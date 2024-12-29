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

def get_country_contributions():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # SQL Query
            query = """
                SELECT 
                    c.country_name,
                    c.country_code,
                    COUNT(DISTINCT a.athlete_code) AS total_athletes,
                    COUNT(DISTINCT co.coach_code) AS total_coaches
                FROM Country c
                LEFT JOIN Athlete a ON c.country_code = a.country_code
                LEFT JOIN Coach co ON c.country_code = co.country_code
                GROUP BY c.country_code
                ORDER BY total_athletes DESC, total_coaches DESC;
            """

            # Execute Query
            cursor.execute(query)
            result = cursor.fetchall()

            # Return data as JSON
            return jsonify(result), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
