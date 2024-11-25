from flask import request, jsonify
import mysql.connector
from settings import db_user, db_password, db_host, db_name
from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error

connection = mysql.connector.connect(
    host=db_host, database=db_name, user=db_user, password=db_password)


def db_connection():
    connection = mysql.connector.connect(
        host=db_host, database=db_name, user=db_user, password=db_password)
    return connection


def get_disciplines():
    try:

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Discipline")
            disciplines = cursor.fetchall()

            # Return data as JSON
            return jsonify(disciplines), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


def delete_disciplines(discipline_id):
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                "DELETE FROM Discipline WHERE id = %s", (discipline_id,))
            connection.commit()

            # Return success message
            return jsonify({'message': 'Discipline deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


def create_discipline():
    try:
        # Get data from POST request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        name = data.get('name')
        discipline_code = data.get('discipline_code')

        # Validate required fields
        if not all([name, discipline_code, id]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = "INSERT INTO Discipline (name, discipline_code) VALUES (%s, %s)"
                cursor.execute(query, (name, discipline_code,))
                connection.commit()

                # Return success message
                return jsonify({'message': 'Discipline created successfully'}), 201
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


def update_discipline(discipline_id):
    try:
        # Get data from POST request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        name = data.get('name')
        discipline_code = data.get('discipline_code')

        # Validate required fields
        if not all([name, discipline_code]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = "UPDATE Discipline SET name = %s, discipline_code = %s WHERE id = %s"
                cursor.execute(query, (name, discipline_code, discipline_id,))
                connection.commit()

                # Return success message
                return jsonify({'message': 'Discipline updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()