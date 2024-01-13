from flask import render_template, jsonify, request
from . import auth  # Import the Blueprint you defined in flaskr/auth/__init__.py
from user_creation import create_user
from user_verification import verify_user

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if data exists and if it contains required fields
    if not data or 'username' not in data or 'password' not in data:
        print("error invalid request data")
        return jsonify({"error": "Invalid request data"}), 400

    username = data['username'].strip()
    password = data['password'].strip()

    if not username:
        print("Error: username not specified")
        return jsonify({"error": "Enter a username"}), 400
    if not password:
        print("Error: Password not specified")
        return jsonify({"error": "Enter a password"}), 400

    success = create_user(username, password)
    if success:
        print("Registration Successful")
        return jsonify({"message": "Registration successful!"}), 201
    else:
        print("Registration failed or username already exists")
        return jsonify({"error": "Registration failed or username already exists"}), 400

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Invalid request data"}), 400

    username = data['username']
    password = data['password']

    is_verified = verify_user(username, password)
    if is_verified:
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid username or password"}), 400
