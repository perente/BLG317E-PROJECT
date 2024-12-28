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

def update_countries(country_code):
    try:
        # Validate JSON payload
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract and validate values
        gold_medal = data.get('gold_medal')
        silver_medal = data.get('silver_medal')
        bronze_medal = data.get('bronze_medal')

        if gold_medal is None or silver_medal is None or bronze_medal is None:
            return jsonify({'error': 'Missing medal fields'}), 400

        if not isinstance(gold_medal, int) or not isinstance(silver_medal, int) or not isinstance(bronze_medal, int):
            return jsonify({'error': 'Medal values must be integers'}), 400

        if gold_medal < 0 or silver_medal < 0 or bronze_medal < 0:
            return jsonify({'error': 'Medal counts cannot be negative'}), 400

        # Connect to the database
        connection = db_connection()
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = """
                    UPDATE Country
                    SET gold_medal = %s, silver_medal = %s, bronze_medal = %s
                    WHERE country_code = %s
                """
                cursor.execute(query, (gold_medal, silver_medal, bronze_medal, country_code))
                connection.commit()

                # Check if any rows were updated
                if cursor.rowcount == 0:
                    return jsonify({'error': f"No country found with country code '{country_code}'"}), 404

                return jsonify({'message': f"Country with country code '{country_code}' updated successfully"}), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Ensure connection is closed
        if 'connection' in locals() and connection.is_connected():
            connection.close()

def new_countries():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        data = data.get('country_data')
        # Extract values from JSON payload
        country_code = data.get('code')
        country_name = data.get('country_name')
        country_long = data.get('country_long')
        gold_medal = data.get('gold_medal', 0)
        silver_medal = data.get('silver_medal', 0)
        bronze_medal = data.get('bronze_medal', 0)

        # Validate required fields
        if not all([country_code, country_name]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if gold_medal < 0 or silver_medal < 0 or bronze_medal < 0:
            return jsonify({'error': 'Medal counts cannot be negative'}), 400
        
        connection = db_connection()
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = "INSERT INTO Country (country_code, country_name, country_long, gold_medal, silver_medal, bronze_medal) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(query, (country_code, country_name, country_long, gold_medal, silver_medal, bronze_medal))
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

def get_top_countries():
    try:
        connection = db_connection()
        if connection.is_connected():
            # Read n from query param, if no n provided it will be 3
            n = request.args.get('n', default=3, type=int)
            query = """
                SELECT
                    country_code,
                    country_name,
                    gold_medal,
                    silver_medal,
                    bronze_medal,
                    total
                FROM Country
                ORDER BY total DESC
                LIMIT %s
            """
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute(query, (n,))
                result = cursor.fetchall()
                return jsonify(result), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()

def get_countries_above_average():
    try:
        connection = db_connection()
        if connection.is_connected():
            #find countries that their total medal count is above the average
            query = """
                SELECT
                    country_code,
                    country_name,
                    gold_medal,
                    silver_medal,
                    bronze_medal,
                    total
                FROM Country
                WHERE total > (
                    SELECT AVG(total) FROM Country
                )
                ORDER BY total DESC
            """
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute(query)
                result = cursor.fetchall()
                return jsonify(result), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()