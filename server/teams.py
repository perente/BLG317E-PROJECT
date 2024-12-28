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

        # Extract query parameters
        team_code = request.args.get('team_code')
        team_name = request.args.get('team_name')
        team_gender = request.args.get('team_gender')
        country_code = request.args.get('country_code')
        discipline_code = request.args.get('discipline_code')
        num_athletes = request.args.get('num_athletes')
        order_by = request.args.get('order_by')
        order = request.args.get('order')

        # Base query
        query = """
            SELECT Teams.*, Country.country_name, Discipline.name AS discipline_name
            FROM Teams
            LEFT JOIN Country ON Teams.country_code = Country.country_code
            LEFT JOIN Discipline ON Teams.discipline_code = Discipline.discipline_code
        """

        # Filters and parameters
        filters = []
        params = []

        if team_code:
            filters.append("Teams.team_code = %s")
            params.append(team_code)
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

        # Fetch related athletes and coaches for each team
        for team in teams:
            team_code = team['team_code']

            # Fetch athletes
            cursor.execute("""
                SELECT A.athlete_code, A.name, A.gender, A.birth_date, A.nationality, A.country_code
                FROM Athlete A
                INNER JOIN Team_Athlete TA ON A.athlete_code = TA.athlete_code
                WHERE TA.team_code = %s
            """, (team_code,))
            team['athlete_list'] = cursor.fetchall()

            # Fetch coaches
            cursor.execute("""
                SELECT C.coach_code, C.name, C.gender, C.country_code
                FROM Coach C
                INNER JOIN Team_Coach TC ON C.coach_code = TC.coach_code
                WHERE TC.team_code = %s
            """, (team_code,))
            team['coach_list'] = cursor.fetchall()

        return jsonify(teams), 200

    except mysql.connector.Error as e:
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
        athlete_codes = data.get('athlete_codes')
        coach_codes = data.get('coach_codes')

        if not team_name or not team_gender:
            return jsonify({'error': 'team_name and team_gender are required'}), 400

        if not discipline_code or not country_code:
            return jsonify({'error': 'discipline_code and country_code are required'}), 400

        if not athlete_codes or not isinstance(athlete_codes, list):
            return jsonify({'error': 'athlete_codes must be a non-empty list'}), 400

        if  not isinstance(coach_codes, list):
            return jsonify({'error': 'coach_codes must be a non-empty list'}), 400

        # Automatically remove duplicate athlete code
        athlete_codes = list(set(athlete_codes))

        coach_codes = list(set(coach_codes))

        # Calculate num_athletes dynamically
        num_athletes = len(athlete_codes)

        cursor.execute("START TRANSACTION")

        
        cursor.execute("""
            SELECT LPAD(
                MAX(CAST(SUBSTRING(team_code, LENGTH(CONCAT(%s, %s,'TEAM', '---', %s)) + 1) AS UNSIGNED)) + 1,
                1,
                '1'
            ) AS next_code
            FROM Teams
            WHERE team_code LIKE CONCAT(%s,%s, 'TEAM', '---', %s, '%')
        """, (discipline_code,team_gender, country_code, discipline_code, team_gender, country_code))
        result = cursor.fetchone()
        next_code = result['next_code'] if result['next_code'] else '1'

        team_code = f"{discipline_code}{team_gender}TEAM---{country_code}{next_code}"

        # Insert team
        cursor.execute("""
            INSERT INTO Teams (team_code, team_name, team_gender, country_code, discipline_code, num_athletes)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (team_code, team_name, team_gender, country_code, discipline_code, num_athletes))

        # Insert athletes into Team_Athlete
        athlete_query = "INSERT INTO Team_Athlete (team_code, athlete_code) VALUES (%s, %s)"
        for athlete_code in athlete_codes:
            cursor.execute(athlete_query, (team_code, athlete_code))

        # Insert coaches into Team_Coach
        coach_query = "INSERT INTO Team_Coach (team_code, coach_code) VALUES (%s, %s)"
        for coach_code in coach_codes:
            cursor.execute(coach_query, (team_code, coach_code))

        connection.commit()

        return jsonify({'message': 'Team, athletes, and coaches added successfully', 'team_code': team_code}), 201

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
        team_name = data.get('team_name')  # Allow updating team_name
        athlete_codes = data.get('athlete_codes')  # List of athlete codes
        coach_codes = data.get('coach_codes')  # List of coach codes (optional)

        if not team_code:
            return jsonify({'error': 'team_code is required'}), 400

        if not athlete_codes or not isinstance(athlete_codes, list) or len(athlete_codes) < 2:
            return jsonify({'error': 'athlete_codes must be a list with at least two athletes'}), 400

        # Start transaction
        cursor.execute("START TRANSACTION")

        # Verify team exists
        cursor.execute("SELECT * FROM Teams WHERE team_code = %s", (team_code,))
        team = cursor.fetchone()
        if not team:
            cursor.execute("ROLLBACK")
            return jsonify({'error': f'Team with code {team_code} not found'}), 404

        # Update team name if provided
        if team_name:
            query = """
                UPDATE Teams
                SET team_name = %s
                WHERE team_code = %s
            """
            cursor.execute(query, (team_name, team_code))

        # Fetch all results before proceeding with another query
        if cursor.with_rows:
            cursor.fetchall()

        # Update athletes
        if athlete_codes:
            athlete_values = ", ".join(f"({athlete_code})" for athlete_code in athlete_codes)
            cursor.execute("CREATE TEMPORARY TABLE IF NOT EXISTS NewAthletes (athlete_code INT);")
            cursor.execute("DELETE FROM NewAthletes;")  # Clear temp table
            cursor.execute(f"INSERT INTO NewAthletes (athlete_code) VALUES {athlete_values};")

            cursor.execute("""
                SELECT a.athlete_code
                FROM NewAthletes a
                LEFT JOIN Team_Athlete ta
                ON a.athlete_code = ta.athlete_code AND ta.team_code = %s
                WHERE ta.athlete_code IS NULL;
            """, (team_code,))
            athletes_to_add = [row['athlete_code'] for row in cursor.fetchall()]

            cursor.execute("""
                SELECT ta.athlete_code
                FROM Team_Athlete ta
                LEFT JOIN NewAthletes a
                ON ta.athlete_code = a.athlete_code
                WHERE ta.team_code = %s AND a.athlete_code IS NULL;
            """, (team_code,))
            athletes_to_remove = [row['athlete_code'] for row in cursor.fetchall()]

            for athlete_code in athletes_to_add:
                cursor.execute("INSERT INTO Team_Athlete (team_code, athlete_code) VALUES (%s, %s)", (team_code, athlete_code))

            for athlete_code in athletes_to_remove:
                cursor.execute("DELETE FROM Team_Athlete WHERE team_code = %s AND athlete_code = %s", (team_code, athlete_code))

        # Automatically update num_athletes based on the count of athletes
        cursor.execute("""
            SELECT COUNT(*) AS num_athletes
            FROM Team_Athlete
            WHERE team_code = %s
        """, (team_code,))
        num_athletes = cursor.fetchone()['num_athletes']

        cursor.execute("""
            UPDATE Teams
            SET num_athletes = %s
            WHERE team_code = %s
        """, (num_athletes, team_code))

        # Update coaches if coach_codes are provided
        if len(coach_codes) > 0 :
            if not isinstance(coach_codes, list):
                return jsonify({'error': 'coach_codes must be a list or omitted'}), 400

            # Remove duplicate coach codes
            coach_codes = list(set(coach_codes))

            coach_values = ", ".join(f"({coach_code})" for coach_code in coach_codes)
            cursor.execute("CREATE TEMPORARY TABLE IF NOT EXISTS NewCoaches (coach_code INT);")
            cursor.execute("DELETE FROM NewCoaches;")  # Clear temp table
            cursor.execute(f"INSERT INTO NewCoaches (coach_code) VALUES {coach_values};")

            cursor.execute("""
                SELECT c.coach_code
                FROM NewCoaches c
                LEFT JOIN Team_Coach tc
                ON c.coach_code = tc.coach_code AND tc.team_code = %s
                WHERE tc.coach_code IS NULL;
            """, (team_code,))
            coaches_to_add = [row['coach_code'] for row in cursor.fetchall()]

            cursor.execute("""
                SELECT tc.coach_code
                FROM Team_Coach tc
                LEFT JOIN NewCoaches c
                ON tc.coach_code = c.coach_code
                WHERE tc.team_code = %s AND c.coach_code IS NULL;
            """, (team_code,))
            coaches_to_remove = [row['coach_code'] for row in cursor.fetchall()]

            for coach_code in coaches_to_add:
                cursor.execute("INSERT INTO Team_Coach (team_code, coach_code) VALUES (%s, %s)", (team_code, coach_code))

            for coach_code in coaches_to_remove:
                cursor.execute("DELETE FROM Team_Coach WHERE team_code = %s AND coach_code = %s", (team_code, coach_code))

        # Commit transaction
        cursor.execute("COMMIT")

        return jsonify({'message': 'Team, athletes, and coaches updated successfully'}), 200

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

#Get all the coach of the team
def get_TeamsCoach():
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
            SELECT C.coach_code, C.name, C.gender, C.country_code
            FROM Coach C
            INNER JOIN Team_Coach TC ON C.coach_code = TC.coach_code
            WHERE TC.team_code = %s
        """
        cursor.execute(query, (team_code,))
        coaches = cursor.fetchall()

        return jsonify({
            'team_code': team_code,
            'team_name': team['team_name'],
            'coaches': coaches
        }), 200

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
