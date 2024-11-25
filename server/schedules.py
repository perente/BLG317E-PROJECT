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


def get_schedules():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM Schedule left join Discipline on Schedule.discipline_code = Discipline.discipline_code")
            schedules = cursor.fetchall()

            # Return data as JSON
            return jsonify(schedules), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


def new_schedules():
    try:
        # Get data from POST request
        data = request.get_json()
        event_data = ""

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        eventID = data.get('event')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        phase = data.get('phase')
        venue = data.get('venue')
        gender = data.get('gender')
        status = data.get('status')

        # Validate required fields
        if not all([eventID, start_date, end_date, phase, gender, venue, status]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()  # Ensure this function is defined elsewhere

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to fetch event details by eventID
                query = "SELECT * FROM Events WHERE events_code = %s"
                cursor.execute(query, (eventID,))

                # Fetch the event data
                event_data = cursor.fetchone()
                if event_data:
                    pass
                else:
                    return jsonify({'error': f'No event found with eventID: {eventID}'}), 404

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Insert schedule into the database
                query = """INSERT INTO Schedule (start_date,end_date,status,discipline_code,event_name,phase,gender,venue,event_code,url) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
                values = (start_date, end_date, status, event_data['discipline_code'], event_data
                          ['event_name'], phase, gender, venue, event_data['events_code'], event_data['url'])
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Schedule created successfully'}), 201

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        # Ensure the connection is closed properly
        if 'connection' in locals() and connection.is_connected():
            connection.close()


def delete_schedules(scheduleID):
    try:
        # Validate required fields
        if not scheduleID:
            return jsonify({'error': 'Missing required fields'}), 400


        # Establish database connection
        connection = db_connection()  # Ensure this function is defined elsewhere

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to delete schedule by scheduleID
                query = "DELETE FROM Schedule WHERE schedule_code = %s"
                cursor.execute(query, (scheduleID,))
                connection.commit()

                return jsonify({'message': 'Schedule deleted successfully'}), 200

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        # Ensure the connection is closed properly
        if 'connection' in locals() and connection.is_connected():
            connection.close()
