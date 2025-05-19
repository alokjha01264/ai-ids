from flask import Flask, render_template, jsonify, Response, request
from flask_login import LoginManager, login_required, current_user, login_user, logout_user
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from mongo import get_user_by_id, get_user_by_email, User
from dotenv import load_dotenv
import os
import time
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
from scapy.all import sniff, IP, TCP

load_dotenv()  # Load environment variables from .env

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")

    mongo = PyMongo(app)
    app.mongo = mongo
    CORS(app, supports_credentials=True)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return get_user_by_id(user_id, mongo)

    from auth import auth
    app.register_blueprint(auth)

    @app.route('/profile')
    @login_required
    def profile():
        return render_template('profile.html', email=current_user.email)

    @app.route('/collect_normal', methods=['POST'])
    @login_required
    def collect_normal():
        def packet_callback(packet):
            if IP in packet and TCP in packet:
                sample = {
                    "user_id": current_user.id,
                    "timestamp": time.time(),
                    "source_ip": packet[IP].src,
                    "destination_ip": packet[IP].dst,
                    "source_port": packet[TCP].sport,
                    "destination_port": packet[TCP].dport,
                    "packet_size": len(packet),
                    "tcp_flags": int(packet[TCP].flags)
                }
                mongo.db.traffic_samples.insert_one(sample)
        sniff(prn=packet_callback, store=0, count=100, timeout=30)
        return f"Normal traffic captured for user {current_user.email}"

    @app.route('/train_model', methods=['POST'])
    @login_required
    def train_model():
        samples = list(mongo.db.traffic_samples.find({"user_id": current_user.id}))
        if not samples or len(samples) < 20:
            return "Not enough data to train model. Please collect more normal traffic.", 400
        df = pd.DataFrame([{
            'packet_size': s['packet_size'],
            'tcp_flags': s['tcp_flags'],
            'source_port': s['source_port'],
            'destination_port': s['destination_port']
        } for s in samples])
        model = IsolationForest(contamination=0.05, random_state=42)
        model.fit(df)
        model_dir = os.path.join('user_models')
        os.makedirs(model_dir, exist_ok=True)
        model_path = os.path.join(model_dir, f'model_{current_user.id}.joblib')
        joblib.dump(model, model_path)
        return f"Model trained and saved for user {current_user.email}"

    @app.route('/run_detection', methods=['POST'])
    @login_required
    def run_detection():
        model_path = os.path.join('user_models', f'model_{current_user.id}.joblib')
        if not os.path.exists(model_path):
            return "No trained model found. Please train your model first.", 400
        model = joblib.load(model_path)
        detected = 0

        def packet_callback(packet):
            nonlocal detected
            if IP in packet and TCP in packet:
                features = [
                    len(packet),
                    int(packet[TCP].flags),
                    packet[TCP].sport,
                    packet[TCP].dport
                ]
                prediction = model.predict([features])
                if prediction[0] == -1:
                    alert = {
                        "user_id": current_user.id,
                        "timestamp": time.time(),
                        "source_ip": packet[IP].src,
                        "destination_ip": packet[IP].dst,
                        "source_port": packet[TCP].sport,
                        "destination_port": packet[TCP].dport,
                        "packet_size": len(packet),
                        "tcp_flags": int(packet[TCP].flags),
                        "alert_type": "anomaly"
                    }
                    mongo.db.alerts.insert_one(alert)
                    detected += 1

        sniff(prn=packet_callback, store=0, count=100, timeout=30)
        return f"Detection finished. {detected} anomalies detected and saved as alerts."

    @app.route('/my_alerts_json')
    @login_required
    def my_alerts_json():
        alerts = list(mongo.db.alerts.find({"user_id": current_user.id}).sort("timestamp", -1))
        return jsonify([{
            "timestamp": alert['timestamp'],
            "source_ip": alert['source_ip'],
            "destination_ip": alert['destination_ip'],
            "source_port": alert['source_port'],
            "destination_port": alert['destination_port'],
            "packet_size": alert['packet_size'],
            "tcp_flags": alert['tcp_flags'],
            "alert_type": alert['alert_type']
        } for alert in alerts])

    @app.route('/export_alerts_csv')
    @login_required
    def export_alerts_csv():
        alerts = list(mongo.db.alerts.find({"user_id": current_user.id}).sort("timestamp", -1))

        def generate():
            headers = ['timestamp', 'source_ip', 'destination_ip', 'source_port', 'destination_port', 'packet_size', 'tcp_flags', 'alert_type']
            yield ','.join(headers) + '\n'
            for alert in alerts:
                row = [
                    str(alert['timestamp']),
                    alert['source_ip'],
                    alert['destination_ip'],
                    str(alert['source_port']),
                    str(alert['destination_port']),
                    str(alert['packet_size']),
                    str(alert['tcp_flags']),
                    alert['alert_type']
                ]
                yield ','.join(row) + '\n'

        return Response(generate(), mimetype='text/csv',
                        headers={'Content-Disposition': 'attachment;filename=alerts.csv'})

    @app.route('/my_sample_count')
    @login_required
    def my_sample_count():
        count = mongo.db.traffic_samples.count_documents({"user_id": current_user.id})
        return f"You have {count} samples."

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
