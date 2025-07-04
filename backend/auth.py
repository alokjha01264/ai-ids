from flask import Blueprint, request, redirect, url_for, render_template, flash, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
from mongo import User

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    mongo = current_app.mongo  # Correct access

    if request.method == 'POST':
        # Handle JSON and form data
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
        else:
            email = request.form.get('email')
            password = request.form.get('password')

        # Check if user exists
        if mongo.db.users.find_one({"email": email}):
            if request.is_json:
                return 'Email address already exists', 409
            flash('Email address already exists')
            return redirect(url_for('auth.signup'))

        # Create new user
        hashed_pw = generate_password_hash(password)
        user_id = mongo.db.users.insert_one({
            "email": email,
            "password": hashed_pw
        }).inserted_id

        # Log in the user
        user_data = mongo.db.users.find_one({"_id": user_id})
        user = User(user_data)
        login_user(user)

        if request.is_json:
            return '', 201
        return redirect(url_for('profile'))
    return render_template('signup.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    mongo = current_app.mongo  # Correct access

    if request.method == 'POST':
        # Handle JSON and form data
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
        else:
            email = request.form.get('email')
            password = request.form.get('password')

        user_data = mongo.db.users.find_one({"email": email})
        if not user_data or not check_password_hash(user_data["password"], password):
            if request.is_json:
                return 'Invalid credentials', 401
            flash('Invalid credentials')
            return redirect(url_for('auth.login'))

        user = User(user_data)
        login_user(user)

        if request.is_json:
            return '', 200
        return redirect(url_for('profile'))
    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
