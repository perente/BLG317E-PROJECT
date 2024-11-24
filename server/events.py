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

def get_events():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Events")
            events = cursor.fetchall()

            # Return data as JSON
            return jsonify(events), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


def new_event():
    try:
        # Get data from POST request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        event_name = data.get('event_name')
        discipline_code = data.get('discipline_code')
        sport_name = data.get('sport_name')
        url = data.get('url')

        # Validate required fields
        if not all([event_name, discipline_code, sport_name, url]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection() # Ensure this function is defined elsewhere

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM Discipline WHERE discipline_code = %s"
                values = (event_name, discipline_code, sport_name, url)
                cursor.execute(query, (discipline_code))
                
                # Fetch the discipline data
                discipline_data = cursor.fetchone()
                if discipline_data_data:
                    pass
                else:
                    return jsonify({'error': f'No discipline found with discipline_code: {discipline_code}'}), 404

                return jsonify({'message': 'Event created successfully'}), 201
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Insert events into the database
                query = """INSERT INTO Events (event_name, discipline_code, sport_name, url) VALUES (%s,%s,%s,%s)"""
                values = (event_name, discipline_code['discipline_code'], sport_name, url)
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Schedule created successfully'}), 201

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        # Ensure the connection is closed properly
        if 'connection' in locals() and connection.is_connected():
            connection.close()
