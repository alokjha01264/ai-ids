# backend/mongo.py
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data["_id"])
        self.email = user_data["email"]
        self.password = user_data["password"]

def get_user_by_email(email, mongo):
    user_data = mongo.db.users.find_one({"email": email})
    return User(user_data) if user_data else None

def get_user_by_id(user_id, mongo):
    user_data = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    return User(user_data) if user_data else None
