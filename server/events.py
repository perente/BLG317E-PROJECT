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

            # Get query parameters
            events_code = request.args.get('events_code')
            event_name = request.args.get('event_name')
            discipline_code = request.args.get('discipline_code')
            sport_name = request.args.get('sport_name')
            order_by = request.args.get('order_by')
            order = request.args.get('order')

            print(events_code, event_name, discipline_code, sport_name)

            # Base query
            query = """
                SELECT * FROM Events
                LEFT JOIN Discipline ON Events.discipline_code = Discipline.discipline_code
            """

            # Where clause conditions
            filters = []
            params = []

            if events_code:
                filters.append("Events.events_code = %s")
                params.append(events_code)

            if event_name:
                filters.append("Events.event_name LIKE %s")
                params.append(f"%{event_name}%")

            if discipline_code:
                filters.append("Events.disciplines = %s")
                params.append(discipline_code)

            if sport_name:
                filters.append("Events.sport_name LIKE %s")
                params.append(f"%{sport_name}%")

            # Add filters to query
            if filters:
                query += " WHERE " + " AND ".join(filters)

            # Order by clause
            if order_by:
                query += f" ORDER BY {order_by} {order or 'ASC'}"

            print("Query:", query)
            print("Params:", params)

            # Execute query with parameters
            cursor.execute(query, params)
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

def delete_event(event_code):
    try:
        # Validate required fields
        if not event_code:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to delete event by event_code
                query = "DELETE FROM Events WHERE events_code = %s"
                cursor.execute(query, (event_code,))
                connection.commit()

                return jsonify({'message': 'Event deleted successfully'}), 200

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

def new_events():
    try:
        # Get data from POST request
        data = request.get_json()
        discipline_data = ""

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        event_code = data.get('events_code')
        event_name = data.get('event_name')
        discipline_code = data.get('discipline_code')
        url = data.get('url')
        sport_name = data.get('sport_name')

        # Validate required fields
        if not all([event_code, event_name, discipline_code, url, sport_name]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Check if discipline_code exists
                query = "SELECT * FROM Discipline WHERE discipline_code = %s"
                cursor.execute(query, (discipline_code,))
                discipline_data = cursor.fetchone()

                if discipline_data:
                    pass
                else:
                    return jsonify({'error': f'Discipline code {discipline_code} does not exist'}), 400
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
        
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Insert event into the database
                query = """
                    INSERT INTO Events (events_code, event_name, discipline_code, url, sport_name)
                    VALUES (%s, %s, %s, %s, %s)
                """
                values = (event_code, event_name, discipline_data['discipline_code'], url, sport_name)
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Event created successfully'}), 201

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

def update_events(event_code):
    try:
        # Get data from PATCH request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        events_code = data.get('events_code')
        event_name = data.get('event_name')
        discipline_code = data.get('discipline_code')
        url = data.get('url')
        sport_name = data.get('sport_name')

        # Validate required fields
        if not event_code:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        discipline_data = ""
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Check if discipline_code exists
                query = "SELECT * FROM Discipline WHERE discipline_code = %s"
                cursor.execute(query, (discipline_code,))
                discipline_data = cursor.fetchone()

                if discipline_data:
                    pass
                else:
                    return jsonify({'error': f'Discipline code {discipline_code} does not exist'}), 400
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
        
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Update event in the database
                query = """
                    UPDATE Events
                    SET event_name = %s, discipline_code = %s, url = %s, sport_name = %s
                    WHERE events_code = %s
                """
                values = (event_name, discipline_code, url, sport_name, event_code)
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Event updated successfully'}), 200

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
