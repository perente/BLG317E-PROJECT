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

def get_countries():
    try:
        # Establish database connection
        connection = db_connection()
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Country")
            countries = cursor.fetchall()
            # Return data as JSON
            return jsonify(countries), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
    except Error as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

def update_country(country_code):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        gold_medal = data.get('gold_medal')
        silver_medal = data.get('silver_medal')
        bronze_medal = data.get('bronze_medal')

        # Validate required fields
        if not any([gold_medal is not None, silver_medal is not None, bronze_medal is not None]):
            return jsonify({'error': 'No medal values provided for update'}), 400

        connection = db_connection()
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = """
                    UPDATE Country 
                    SET gold_medal = %s, silver_medal = %s, bronze_medal = %s 
                    WHERE code = %s
                """
                cursor.execute(query, (gold_medal, silver_medal, bronze_medal, country_code))
                connection.commit()
                # Return success message
                return jsonify({'message': f"Country with country code '{country_code}' updated successfully"}), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
    except Error as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

def create_country():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        code = data.get('code')
        country_name = data.get('country_name')
        country_long = data.get('country_long')
        gold_medal = data.get('gold_medal', 0)
        silver_medal = data.get('silver_medal', 0)
        bronze_medal = data.get('bronze_medal', 0)

        # Validate required fields
        if not all([code, country_name, country_long]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        connection = db_connection()
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = "INSERT INTO Country (code, country_name, country_long, gold_medal, silver_medal, bronze_medal) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(query, (code, country_name, country_long, gold_medal, silver_medal, bronze_medal))
                connection.commit()
                # Return success message
                return jsonify({'message': 'Country created successfully'}), 201
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
    except Error as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

def delete_country(country_code):
    try:
        connection = db_connection()
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute("DELETE FROM Country WHERE country_code = %s", (country_code,))
                connection.commit()
                # Return success message
                return jsonify({'message': 'Country deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
    except Error as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()



