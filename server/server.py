from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error
from settings import db_user,db_password,db_host,db_name  
from flask_cors import CORS, cross_origin

connection = mysql.connector.connect(host=db_host, database=db_name, user=db_user, password=db_password)    


app = Flask(__name__)
CORS(app, support_credentials=True)


def db_connection():
    connection = mysql.connector.connect(host=db_host, database=db_name, user=db_user, password=db_password)
    return connection


# example get request
@app.route('/schedules', methods=['GET'])
def get_schedules():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Schedule")
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

@app.route('/disciplines', methods=['GET'])
def get_disciplines():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Discipline")
            disciplines = cursor.fetchall()

            # Return data as JSON
            return jsonify(disciplines), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/events', methods=['GET'])
def get_events():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Events")
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

@app.route('/countries', methods=['GET'])
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

@app.route('/team_athlete', methods=['GET'])
def get_teams_athlete():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Team_Athlete")
            team_athlete = cursor.fetchall()

            # Return data as JSON
            return jsonify(team_athlete), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/team_coach', methods=['GET'])
def get_teams_coach():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Team_Coach")
            team_coach = cursor.fetchall()

            # Return data as JSON
            return jsonify(team_coach), 200
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
