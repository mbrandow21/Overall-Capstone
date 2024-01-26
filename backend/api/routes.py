from flask import request, jsonify
from . import api  # Import the Blueprint you defined in flaskr/auth/__init__.py
from flask import Flask, jsonify, request
from ..tokens import authenticateToken
import pyodbc
from ..dbconnection import dbconnection
import base64



@api.route('/get', methods=['GET'])
def get_data():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"error": "Bearer token not found"}), 401

    user_id, status_code = authenticateToken(token)

    if status_code != 200:
        return jsonify({"error": "Authentication failed"}), status_code

    tableName = request.args.get('from')
    select = request.args.get('select', '*')  # Defaults to '*' if 'select' is not provided
    filter = request.args.get('filter', None)
    # Validate tableName and select here

    print(tableName)

    connection_string = dbconnection()
    from flask import jsonify

# Inside your endpoint function, after fetching data with cursor.fetchall()
    try:
        with pyodbc.connect(connection_string) as connection:
            with connection.cursor() as cursor:
                cursor.execute("EXEC api_GetProcedure ?, ?, ?, ?", tableName, select, filter, user_id)
                rows = cursor.fetchall()
                
                # Convert rows to a list of dicts
                columns = [column[0] for column in cursor.description]
                data = [dict(zip(columns, row)) for row in rows]

                # Handle bytes data
                for item in data:
                    for key, value in item.items():
                        if isinstance(value, bytes):
                            item[key] = base64.b64encode(value).decode('utf-8')  # Convert bytes to Base64 encoded string

                # Use jsonify to return the data
                return jsonify(data) if data else jsonify({"error": "No data found"})
    except pyodbc.Error as e:
        # Log the error
        return jsonify({"error": "Server error"}), 500

