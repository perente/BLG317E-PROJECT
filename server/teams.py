from flask import request, jsonify
import mysql.connector
from settings import db_user, db_password, db_host, db_name, db_port
from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error

connection = mysql.connector.connect(
    host=db_host, database=db_name, user=db_user, port=db_port, password=db_password)


def db_connection():
    connection = mysql.connector.connect(
        host=db_host, database=db_name, user=db_user,port=db_port, password=db_password)
    return connection

def get_teams():
    try:
        connection = db_connection()
        cursor = connection.cursor(dictionary=True)

        team_code = request.args.get('team_code')
        team_name = request.args.get('team_name')
        team_gender = request.args.get('team_gender')
        country_code = request.args.get('country_code')
        discipline_code = request.args.get('discipline_code')
        num_athletes = request.args.get('num_athletes')
        order_by = request.args.get('order_by')
        order = request.args.get('order')

        query = """
            SELECT Teams.*, Country.country_name, Discipline.name AS discipline_name
            FROM Teams
            LEFT JOIN Country ON Teams.country_code = Country.country_code
            LEFT JOIN Discipline ON Teams.discipline_code = Discipline.discipline_code
        """

        filters = []
        params = []

        if team_code:
            filters.append("Teams.team_code = %s")
            params.append(team_code)
            print("Teams:", team_code)
        if team_name:
            filters.append("Teams.team_name LIKE %s")
            params.append(f"%{team_name}%")
        if team_gender:
            filters.append("Teams.team_gender = %s")
            params.append(team_gender)
        if country_code:
            filters.append("Teams.country_code = %s")
            params.append(country_code)
        if discipline_code:
            filters.append("Teams.discipline_code = %s")
            params.append(discipline_code)

        if num_athletes:
            filters.append("Teams.num_athletes = %s")
            params.append(num_athletes)

        if filters:
            query += " WHERE " + " AND ".join(filters)

        if order_by:
            query += f" ORDER BY {order_by} {order or 'ASC'}"

        cursor.execute(query, params)
        teams = cursor.fetchall()

        #print("Query Result:", teams)

        return jsonify(teams), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


def new_teams():
    try:
        connection = db_connection()
        cursor = connection.cursor(dictionary=True)

        data = request.json
        team_code = data.get('team_code')
        team_name = data.get('team_name')
        team_gender = data.get('team_gender')
        country_code = data.get('country_code')
        discipline_code = data.get('discipline_code')
        num_athletes = data.get('num_athletes')

        if not team_code or not team_name or not team_gender:
            return jsonify({'error': 'team_code, team_name, and team_gender are required'}), 400

        cursor.execute("SELECT * FROM Teams WHERE team_code = %s", (team_code,))
        if cursor.fetchone():
            return jsonify({'error': f'Team with code {team_code} already exists'}), 409

        query = """
            INSERT INTO Teams (team_code, team_name, team_gender, country_code, discipline_code, num_athletes)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (team_code, team_name, team_gender, country_code, discipline_code, num_athletes))
        connection.commit()

        return jsonify({'message': 'Team created successfully'}), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


def delete_team(team_code):
    try:
        if not team_code:
            return jsonify({'error': 'Missing required fields'}), 400

        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                query = "DELETE FROM Teams WHERE team_code = %s"
                cursor.execute(query, (team_code,))
                connection.commit()

                if cursor.rowcount == 0:
                    return jsonify({'error': f'Team with code {team_code} not found'}), 404

                return jsonify({'message': 'Team deleted successfully'}), 200

        return jsonify({'error': 'Failed to connect to the database'}), 500

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()

def update_team():
    try:
        connection = db_connection()
        cursor = connection.cursor(dictionary=True)

        data = request.json
        team_code = data.get('team_code')
        team_name = data.get('team_name')
        team_gender = data.get('team_gender')
        country_code = data.get('country_code')
        discipline_code = data.get('discipline_code')
        num_athletes = data.get('num_athletes')

        if not team_code:
            return jsonify({'error': 'team_code is required'}), 400

        query = """
            UPDATE Teams
            SET team_name = %s, team_gender = %s, country_code = %s, discipline_code = %s, num_athletes = %s
            WHERE team_code = %s
        """
        cursor.execute(query, (team_name, team_gender, country_code, discipline_code, num_athletes, team_code))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': f'Team with code {team_code} not found'}), 404

        return jsonify({'message': 'Team updated successfully'}), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()