import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from .auth import auth
from .api import api

app = Flask(__name__)
CORS(app)

def create_app():
    """Application factory function to create and configure the Flask app."""
    
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    app.register_blueprint(auth, url_prefix='/auth')

    app.register_blueprint(api, url_prefix='/api')

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Sample route
    @app.route('/api/postdata', methods=['POST'])
    def post_data():
        data = request.json
        print(data)
        return jsonify({'status': 'Data received'})

    CORS(app, origins=["https://yourfrontend.com", "http://localhost:3000"])

    
    return app

if __name__ == '__main__':
    app.run(debug=True)
