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


def new_team():
    try:
        connection = db_connection()
        cursor = connection.cursor(dictionary=True)

        data = request.json
        team_name = data.get('team_name')
        team_gender = data.get('team_gender')
        country_code = data.get('country_code')
        discipline_code = data.get('discipline_code')
        num_athletes = data.get('num_athletes')
        athlete_codes = data.get('athlete_codes') 

        if not team_name or not team_gender:
            return jsonify({'error': 'team_name and team_gender are required'}), 400

        if not discipline_code or not num_athletes or not country_code:
            return jsonify({'error': 'discipline_code, num_athletes, and country_code are required'}), 400

        if not athlete_codes or not isinstance(athlete_codes, list):
            return jsonify({'error': 'athlete_codes must be a non-empty list'}), 400

        cursor.execute("START TRANSACTION")

        # Generate team_code manually
        cursor.execute("""
            SELECT LPAD(
                MAX(CAST(SUBSTRING(team_code, LENGTH(CONCAT(%s, 'TEAM', %s, '---', %s)) + 1) AS UNSIGNED)) + 1,
                1,
                '1'
            ) AS next_code
            FROM Teams
            WHERE team_code LIKE CONCAT(%s, 'TEAM', %s, '---', %s, '%')
        """, (discipline_code, num_athletes, country_code, discipline_code, num_athletes, country_code))
        result = cursor.fetchone()
        next_code = result['next_code'] if result['next_code'] else '1'

        team_code = f"{discipline_code}TEAM{num_athletes}---{country_code}{next_code}"

        # Insert team
        cursor.execute("""
            INSERT INTO Teams (team_code, team_name, team_gender, country_code, discipline_code, num_athletes)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (team_code, team_name, team_gender, country_code, discipline_code, num_athletes))

        connection.commit()

        # Insert athletes into Team_Athlete
        athlete_query = "INSERT INTO Team_Athlete (team_code, athlete_code) VALUES (%s, %s)"
        for athlete_code in athlete_codes:
            cursor.execute(athlete_query, (team_code, athlete_code))
            print("Inserted",athlete_code)

        connection.commit()

        return jsonify({'message': 'Team and athletes added successfully', 'team_code': team_code}), 201

    except mysql.connector.Error as e:
        connection.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        connection.rollback()
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

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

def update_team(team_code):
    try:
        connection = db_connection()
        cursor = connection.cursor(dictionary=True)

        data = request.json
        team_name = data.get('team_name')
        team_gender = data.get('team_gender')
        country_code = data.get('country_code')
        discipline_code = data.get('discipline_code')
        num_athletes = data.get('num_athletes')
        athlete_codes = data.get('athlete_codes')  # List of athlete codes

        if not team_code:
            return jsonify({'error': 'team_code is required'}), 400
        
        if not athlete_codes or not isinstance(athlete_codes, list) or len(athlete_codes) < 2:
            return jsonify({'error': 'athlete_codes must be a list with at least two athletes'}), 400
        
        # Transaction
        cursor.execute("START TRANSACTION")

        # Update teams attributes
        query = """
            UPDATE Teams
            SET team_name = %s, team_gender = %s, country_code = %s, discipline_code = %s, num_athletes = %s
            WHERE team_code = %s
        """
        cursor.execute(query, (team_name, team_gender, country_code, discipline_code, num_athletes, team_code))

        if cursor.rowcount == 0:
            cursor.execute("ROLLBACK")
            return jsonify({'error': f'Team with code {team_code} not found'}), 404

        if athlete_codes:
            # Yeni atletler için geçici tablo oluştur
            athlete_values = ", ".join(f"({athlete_code})" for athlete_code in athlete_codes)
            cursor.execute("CREATE TEMPORARY TABLE NewAthletes (athlete_code INT);")
            cursor.execute(f"INSERT INTO NewAthletes (athlete_code) VALUES {athlete_values};")

            # Find which athlete will be added
            cursor.execute("""
                SELECT a.athlete_code
                FROM NewAthletes a
                LEFT JOIN Team_Athlete ta
                ON a.athlete_code = ta.athlete_code AND ta.team_code = %s
                WHERE ta.athlete_code IS NULL;
            """, (team_code,))
            athletes_to_add = [row['athlete_code'] for row in cursor.fetchall()]

            # Find which athlete will be deleted
            cursor.execute("""
                SELECT ta.athlete_code
                FROM Team_Athlete ta
                LEFT JOIN NewAthletes a
                ON ta.athlete_code = a.athlete_code
                WHERE ta.team_code = %s AND a.athlete_code IS NULL;
            """, (team_code,))
            athletes_to_remove = [row['athlete_code'] for row in cursor.fetchall()]

            # Add new athletes
            for athlete_code in athletes_to_add:
                cursor.execute("INSERT INTO Team_Athlete (team_code, athlete_code) VALUES (%s, %s)", (team_code, athlete_code))

            # Delete old athletes
            for athlete_code in athletes_to_remove:
                cursor.execute("DELETE FROM Team_Athlete WHERE team_code = %s AND athlete_code = %s", (team_code, athlete_code))

        # Complete transaction 
        cursor.execute("COMMIT")

        return jsonify({'message': 'Team and athletes updated successfully'}), 200

    except mysql.connector.Error as e:
        cursor.execute("ROLLBACK")
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        cursor.execute("ROLLBACK")
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

#Get all the athletes of the team
def get_TeamsAthlete():
    try:
        connection = db_connection()
        cursor = connection.cursor(dictionary=True)

        team_code = request.args.get('team_code')

        # Check if the team exists
        cursor.execute("SELECT * FROM Teams WHERE team_code = %s", (team_code,))
        team = cursor.fetchone()
        if not team:
            return jsonify({'error': f'Team with code {team_code} does not exist'}), 404

        query = """
            SELECT A.athlete_code, A.name, A.gender, A.birth_date, A.nationality, A.country_code
            FROM Athlete A
            INNER JOIN Team_Athlete TA ON A.athlete_code = TA.athlete_code
            WHERE TA.team_code = %s
        """
        cursor.execute(query, (team_code,))
        athletes = cursor.fetchall()

        return jsonify({
            'team_code': team_code,
            'team_name': team['team_name'],
            'athletes': athletes
        }), 200

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


#Delete spesific athlete from a team
def delete_TeamsAthlete():
    try:
        connection = db_connection()
        cursor = connection.cursor(dictionary=True)

        data = request.json
        team_code = data.get('team_code')
        athlete_code = data.get('athlete_code')

        if not team_code or not athlete_code:
            return jsonify({'error': 'Both team_code and athlete_code are required'}), 400

        # Check if the team exists
        cursor.execute("SELECT * FROM Teams WHERE team_code = %s", (team_code,))
        team = cursor.fetchone()
        if not team:
            return jsonify({'error': f'Team with code {team_code} does not exist'}), 404

        # Check if the athlete exists in the team
        cursor.execute(
            "SELECT * FROM Team_Athlete WHERE team_code = %s AND athlete_code = %s",
            (team_code, athlete_code)
        )
        team_athlete = cursor.fetchone()
        if not team_athlete:
            return jsonify({'error': f'Athlete with code {athlete_code} is not part of team {team_code}'}), 404

        # Remove the athlete from the team
        cursor.execute(
            "DELETE FROM Team_Athlete WHERE team_code = %s AND athlete_code = %s",
            (team_code, athlete_code)
        )
        connection.commit()

        return jsonify({'message': f'Athlete with code {athlete_code} removed from team {team_code} successfully'}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

