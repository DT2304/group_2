# utils.py
from functools import wraps
from flask import request, jsonify
from models import mongo

def check_role(role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            username = request.json.get('username')
            user = mongo.db.users.find_one({'username': username})
            if user and user.get('role') == role:
                return f(*args, **kwargs)
            return jsonify({"error": "Unauthorized"}), 403
        return wrapper
    return decorator
