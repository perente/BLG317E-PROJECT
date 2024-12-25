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

def get_leaderboard():
    try:
        # Establish database connection
        connection = db_connection()
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Country ORDER BY total DESC, gold_medal DESC, silver_medal DESC, bronze_medal DESC")
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


def get_country_medals_on_disciplines(country_code):
    try:
        # Establish database connection
        connection = db_connection()
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            
            # SQL query to fetch medal counts grouped by discipline
            query = """
                SELECT 
                    d.name AS discipline_name,
                    SUM(CASE WHEN m.medal_code = 1 THEN 1 ELSE 0 END) AS gold_medals,
                    SUM(CASE WHEN m.medal_code = 2 THEN 1 ELSE 0 END) AS silver_medals,
                    SUM(CASE WHEN m.medal_code = 3 THEN 1 ELSE 0 END) AS bronze_medals
                FROM 
                    Medallist m
                JOIN 
                    Discipline d ON m.discipline = d.name
                WHERE 
                    m.country_code = %s
                GROUP BY 
                    d.name
                ORDER BY 
                    gold_medals DESC, silver_medals DESC, bronze_medals DESC;
            """
            
            # Execute query
            cursor.execute(query, (country_code,))
            medals_by_discipline = cursor.fetchall()
            
            # Return data as JSON
            return jsonify(medals_by_discipline), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Ensure connections are properly closed
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
