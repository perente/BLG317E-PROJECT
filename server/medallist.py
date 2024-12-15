from flask import request, jsonify
import mysql.connector
from settings import db_user, db_password, db_host, db_name
from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error

connection = mysql.connector.connect(
    host=db_host, database=db_name, user=db_user, password=db_password)


def db_connection():
    return mysql.connector.connect(
        host=db_host, database=db_name, user=db_user, password=db_password)


def get_medallists():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Get query parameters
            id = request.args.get('id')
            name = request.args.get('name')
            medal_date = request.args.get('medal_date')
            medal_code = request.args.get('medal_code')
            gender = request.args.get('gender')
            country_code = request.args.get('country_code')
            code_team = request.args.get('code_team')
            code_athlete = request.args.get('code_athlete')
            discipline = request.args.get('discipline')
            order_by = request.args.get('order_by')
            order = request.args.get('order')

            # Base query
            query = """
                SELECT * FROM Medallist
            """

            filters = []
            params = []

            if id:
                filters.append("id = %s")
                params.append(id)

            if name:
                filters.append("name = %s")
                params.append(name)

            if medal_date:
                filters.append("medal_date = %s")
                params.append(medal_date)

            if medal_code:
                filters.append("medal_code = %s")
                params.append(medal_code)

            if gender:
                filters.append("gender = %s")
                params.append(medal_code)

            if country_code:
                filters.append("country_code = %s")
                params.append(country_code)

            if code_team:
                filters.append("code_team = %s")
                params.append(code_team)

            if code_athlete:
                filters.append("code_athlete = %s")
                params.append(code_athlete)

            if discipline:
                filters.append("discipline = %s")
                params.append(discipline)

            if filters:
                query += " WHERE " + " AND ".join(filters)

            if order_by:
                query += f" ORDER BY {order_by} {order or 'ASC'}"

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


def new_medallists():
    try:
        # Get data from POST request
        data = request.get_json()
        event_data = ""

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        id = data.get('id')
        name = data.get('name')
        medal_date = data.get('medal_date')
        medal_code = data.get('medal_code')
        gender = data.get('gender')
        country_code = data.get('country_code')
        code_team = data.get('code_team')
        code_athlete = data.get('code_athlete')
        discipline = data.get('discipline')
        event = data.get('event')

        # Validate required fields
        if not all([id, name, medal_date, medal_code, gender, country_code, code_athlete, discipline, event]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Insert medallist into the database
                query = """INSERT INTO Medallist (id, name, medal_date, medal_code, gender, country_code, code_team, code_athlete, discipline, event) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
                values = (
                id, name, medal_date, medal_code, gender, country_code, code_team, code_athlete, discipline, event)
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Medallist created successfully'}), 201

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


def delete_medallists(ID):
    try:
        # Validate required fields
        if not ID:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to delete medallist by ID
                query = "DELETE FROM Medallist WHERE id = %s"
                cursor.execute(query, (ID,))
                connection.commit()

                return jsonify({'message': 'Medallist deleted successfully'}), 200

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
