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


def get_athletes():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Get query parameters
            athlete_code = request.args.get('athlete_code')
            name = request.args.get('name')
            gender = request.args.get('gender')
            country_code = request.args.get('country_code')
            nationality = request.args.get('nationality')
            birth_date = request.args.get('birth_date')
            order_by = request.args.get('order_by')
            order = request.args.get('order')
            

            print(athlete_code,name,gender,country_code,nationality,birth_date)

            # Base query
            query = """
                SELECT * FROM Athletes
                LEFT JOIN Country ON Athlete.country_code = Country.country_code
            """

            # Where clause conditions
            filters = []
            params = []

            if athlete_code:
                filters.append("Athlete.athlete_code = %s")
                params.append(athlete_code)

            if name:
                filters.append("Athlete.name LIKE %s")
                params.append(f"%{name}%")

            if gender:
                filters.append("Athlete.gender = %s")
                params.append(gender)

            if country_code:
                filters.append("Athlete.country_code = %s")
                params.append(country_code)  

            if nationality:
                filters.append("Athlete.nationality = %s")
                params.append(nationality)  

            if birth_date:
                filters.append("Athlete.birth_date >= %s")
                params.append(birth_date)


            # Add filters to query
            if filters:
                query += " WHERE " + " AND ".join(filters)

            # Order by clause
            if order_by:
                query += f" ORDER BY {order_by} {order or 'ASC'}"
            # Execute query with parameters
            cursor.execute(query, params)
            athletes = cursor.fetchall()

            # Return data as JSON
            return jsonify(athletes), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


