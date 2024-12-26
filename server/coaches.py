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


def get_coaches():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Get query parameters
            coach_code = request.args.get('coach_code')
            name = request.args.get('name')
            gender = request.args.get('gender')
            coach_function = request.args.get('coach_function')
            country_code = request.args.get('country_code')
            disciplines = request.args.get('disciplines')
            birth_date = request.args.get('birth_date')
            order_by = request.args.get('order_by')
            order = request.args.get('order')
            

            print(coach_code,name,gender,coach_function,country_code,disciplines,birth_date)

            # Base query
            query = """
                SELECT * FROM Coach
                LEFT JOIN Country ON Coach.country_code = Country.country_code
            """

            # Where clause conditions
            filters = []
            params = []

            if coach_code:
                filters.append("Coach.coach_code = %s")
                params.append(coach_code)

            if name:
                filters.append("Coach.name LIKE %s")
                params.append(f"%{name}%")

            if gender:
                filters.append("Coach.gender = %s")
                params.append(gender)

            if country_code:
                filters.append("Coach.country_code = %s")
                params.append(country_code)  

            if coach_function:
                filters.append("Coach.coach_function LIKE %s")
                params.append(f"%{coach_function}%")

            if disciplines:
                filters.append("Coach.disciplines = %s")
                params.append(disciplines)  

            if birth_date:
                filters.append("Coach.birth_date >= %s")
                params.append(birth_date)


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
            coaches = cursor.fetchall()

            # Return data as JSON
            return jsonify(coaches), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


def delete_coaches(coachID):
    try:
        # Validate required fields
        if not coachID:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()  # Ensure this function is defined elsewhere

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to delete Coach by coachID
                query = "DELETE FROM Coach WHERE coach_code = %s"
                cursor.execute(query, (coachID,))
                connection.commit()

                return jsonify({'message': 'Coach deleted successfully'}), 200

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
    

def new_coaches():
    try:
        # Get data from POST request
        data = request.get_json()
        country_data = ""

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        coach_code = data.get('coach_code')
        name = data.get('name')
        gender = data.get('gender')
        coach_function = data.get('coach_function')
        country_code = data.get('country_code')
        disciplines = data.get('disciplines')
        birth_date = data.get('birth_date')

        # Validate required fields
        if not all([coach_code,gender, name, country_code, coach_function,birth_date,disciplines]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()  # Ensure this function is defined elsewhere

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to fetch event details by eventID
                query = "SELECT * FROM Country WHERE country_code = %s"
                cursor.execute(query, (country_code,))

                # Fetch the event data
                country_data = cursor.fetchone()
                if country_data:
                    pass
                else:
                    return jsonify({'error': f'No event found with eventID: {country_code}'}), 404

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Insert coach into the database
                query = """INSERT INTO Coach (coach_code,name,gender,coach_function,country_code,disciplines,birth_date) VALUES (%s,%s,%s,%s,%s,%s,%s)"""
                values = (coach_code, name, gender, coach_function, country_data['country_code'], disciplines,
                          birth_date)
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Coach created successfully'}), 201

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


def update_coach(coachID):
    try:
        # Get data from PATCH request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        coach_code = data.get('coach_code')
        name = data.get('name')
        gender = data.get('gender')
        country_code = data.get('country_code')
        coach_function = data.get('coach_function')
        disciplines = data.get('disciplines')
        birth_date = data.get('birth_date')

        # Validate required fields
        if not coachID:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        country_data = ""
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to fetch event details by eventID
                query = "SELECT * FROM Country WHERE country_code = %s"
                cursor.execute(query, (country_code,))

                # Fetch the event data
                country_data = cursor.fetchone()
                if country_data:
                    pass
                else:
                    return jsonify({'error': f'No event found with country_code: {country_code}'}), 404

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Update schedule in the database
                query = """UPDATE Coach SET name = %s, gender = %s, country_code = %s, coach_function = %s, birth_date = %s, disciplines = %s WHERE coach_code = %s"""
                values = (name, gender, country_code, coach_function, 
                          birth_date, disciplines, coachID)
                cursor.execute(query, values)
                connection.commit()

                return jsonify({'message': 'Coach updated successfully'}), 200

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