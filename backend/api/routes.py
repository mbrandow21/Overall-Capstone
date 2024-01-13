from flask import render_template, jsonify
from . import api  # Import the Blueprint you defined in flaskr/auth/__init__.py
from flask import Flask, jsonify, request


@api.route('/postdata', methods=['POST'])
def post_data():
    data = request.json
    print(data)
    return jsonify({'status': 'Data received'})