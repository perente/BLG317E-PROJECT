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

            # Get query parameters
            discipline_code = request.args.get('discipline_code')
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')
            venue = request.args.get('venue')
            phase = request.args.get('phase')
            event_code = request.args.get('event_code')
            status = request.args.get('status')
            gender = request.args.get('gender')
            order_by = request.args.get('order_by')
            order = request.args.get('order', 'ASC').upper()

            print(discipline_code, start_date, end_date,
                  venue, phase, status, gender)

            # Validate `order` value
            if order not in ['ASC', 'DESC']:
                order = 'ASC'

            # Base query
            query = """
                SELECT
                    Events.sport_name AS name,
                    Events.event_name,
                    Schedule.start_date,
                    Schedule.end_date,
                    Schedule.status,
                    Schedule.phase,
                    Schedule.gender,
                    Schedule.venue,
                    Schedule.event_code,
                    Schedule.schedule_code,
                    Schedule.url
                FROM Schedule
                LEFT JOIN Events ON Schedule.event_code = Events.events_code
            """

            # Where clause conditions
            filters = []
            params = []

            if discipline_code:
                filters.append("Events.discipline_code = %s")
                params.append(discipline_code)

            if start_date:
                filters.append("Schedule.start_date >= %s")
                params.append(start_date)

            if end_date:
                filters.append("Schedule.end_date <= %s")
                params.append(end_date)

            if venue:
                filters.append("Schedule.venue LIKE %s")
                params.append(f"%{venue}%")  # Use LIKE for partial matching

            if phase:
                filters.append("Schedule.phase LIKE %s")
                params.append(f"%{phase}%")  # Use LIKE for partial matching

            if event_code:
                filters.append("Schedule.event_code = %s")
                params.append(event_code)

            if status:
                filters.append("Schedule.status = %s")
                params.append(status)

            if gender:
                filters.append("Schedule.gender = %s")
                params.append(gender)

            # Add filters to query
            if filters:
                query += " WHERE " + " AND ".join(filters)

            # Order by clause
            if order_by:
                query += f" ORDER BY {order_by} {order}"
            else:
                query += " ORDER BY Schedule.start_date ASC"

            # Execute query with parameters
            cursor.execute(query, params)
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
                query = """INSERT INTO Schedule (start_date,end_date,status,phase,gender,venue,event_code,url) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"""
                values = (start_date, end_date, status, phase, gender,
                          venue, event_data['events_code'], event_data['url'])
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


def update_schedule(scheduleID):
    try:
        # Get data from PATCH request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        phase = data.get('phase')
        venue = data.get('venue')
        eventID = data.get('event')
        gender = data.get('gender')
        status = data.get('status')

        # Validate required fields
        if not scheduleID:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        event_data = ""
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
                # Update schedule in the database
                query = """UPDATE Schedule SET start_date = %s, end_date = %s, phase = %s, venue = %s, event_code = %s, gender = %s, status = %s , url = %s WHERE schedule_code = %s"""
                values = (start_date, end_date, phase, venue,
                          eventID, gender, status, event_data['url'], scheduleID)
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Schedule updated successfully'}), 200

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


def update_schedules():
    try:

        data = request.get_json() if request.is_json else request.args

        if not data:
            return jsonify({'error': 'Invalid input: No parameters provided'}), 400

        start_date = data.get('start_date')
        end_date = data.get('end_date')
        delay_days = data.get('delay_days')
        venue = data.get('venue')
        phase = data.get('phase')
        event_code = data.get('event_code')
        status = data.get('status')
        gender = data.get('gender')
        new_gender = data.get('new_gender')
        new_status = data.get('new_status')
        new_phase = data.get('new_phase')
        new_venue = data.get('new_venue')
        new_event_code = data.get('new_event_code')

        # Convert delay_days to int if provided
        if delay_days is not None and delay_days != "":
            try:
                delay_days = int(delay_days)
            except ValueError:
                return jsonify({'error': 'delay_days must be an integer'}), 400
        else:
            delay_days = None

        filter_clauses = []

        if start_date != "":
            filter_clauses.append(f"start_date >= '{start_date}'")
        if end_date != "":
            filter_clauses.append(f"end_date <= '{end_date}'")
        if venue != "":
            filter_clauses.append(f"venue = '{venue}'")
        if phase != "":
            filter_clauses.append(f"phase = '{phase}'")
        if event_code != "":
            filter_clauses.append(f"event_code = '{event_code}'")
        if status != "":
            filter_clauses.append(f"status = '{status}'")
        if gender != "":
            filter_clauses.append(f"gender = '{gender}'")

        set_clauses = []

        if delay_days != "":
            set_clauses.append(
                f"start_date = DATE_ADD(start_date, INTERVAL {delay_days} DAY)")
            set_clauses.append(
                f"end_date = DATE_ADD(end_date, INTERVAL {delay_days} DAY)")
        if new_gender != "":
            set_clauses.append(f"gender = '{new_gender}'")
        if new_status != "":
            set_clauses.append(f"status = '{new_status}'")
        if new_phase != "":
            set_clauses.append(f"phase = '{new_phase}'")
        if new_venue != "":
            set_clauses.append(f"venue = '{new_venue}'")
        if new_event_code != "":
            set_clauses.append(f"event_code = '{new_event_code}'")

        if not set_clauses:
            return jsonify({'error': 'No fields to update'}), 400
        
        query = "UPDATE Schedule SET " + ", ".join(set_clauses)

        if filter_clauses:
            query += " WHERE " + " AND ".join(filter_clauses)

        connection = db_connection()
        if not connection.is_connected():
            return jsonify({'error': 'Failed to connect to the database'}), 500

        with connection.cursor(dictionary=True) as cursor:
            cursor.execute(query)
            connection.commit()
            affected_rows = cursor.rowcount

            return jsonify({'message': 'Schedules updated successfully', 'affected_rows': affected_rows}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()
