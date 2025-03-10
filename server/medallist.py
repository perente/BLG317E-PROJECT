from flask import request, jsonify
import mysql.connector
from settings import db_user, db_password, db_host, db_name
from mysql.connector import Error

connection = mysql.connector.connect(
    host=db_host, database=db_name, user=db_user, password=db_password)


def db_connection():
    return mysql.connector.connect(
        host=db_host, database=db_name, user=db_user, password=db_password)


def get_medallists():
    try:
        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Get query parameters
            id = request.args.get('id')
            medal_date = request.args.get('medal_date')
            medal_code = request.args.get('medal_code')
            athlete_gender = request.args.get('athlete_gender')
            country_code = request.args.get('country_code')
            code_team = request.args.get('code_team')
            code_athlete = request.args.get('code_athlete')
            discipline = request.args.get('discipline')
            athlete_name = request.args.get('athlete_name')  # New filter for athlete name
            order_by = request.args.get('order_by')
            order = request.args.get('order')
            event = request.args.get('event')

            # Base query with JOIN
            query = """
                SELECT 
                    Medallist.*, 
                    Athlete.name AS athlete_name,
                    Athlete.gender AS athlete_gender
                FROM Medallist
                LEFT JOIN Athlete ON Medallist.code_athlete = Athlete.athlete_code
            """

            filters = []
            params = []

            if id:
                filters.append("Medallist.id = %s")
                params.append(id)

            if medal_date:
                filters.append("Medallist.medal_date = %s")
                params.append(medal_date)

            if medal_code:
                filters.append("Medallist.medal_code = %s")
                params.append(medal_code)

            if country_code:
                filters.append("Medallist.country_code = %s")
                params.append(country_code)

            if code_team:
                filters.append("Medallist.code_team = %s")
                params.append(code_team)

            if code_athlete:
                filters.append("Medallist.code_athlete = %s")
                params.append(code_athlete)

            if discipline:
                filters.append("Medallist.discipline = %s")
                params.append(discipline)

            if event:
                filters.append("Medallist.event = %s")
                params.append(event)

            if athlete_name:  # Filter for athlete name
                filters.append("Athlete.name LIKE %s")
                params.append(f"%{athlete_name}%")

            if athlete_gender:
                filters.append("Athlete.gender LIKE %s")
                params.append(f"%{athlete_gender}%")

            if filters:
                query += " WHERE " + " AND ".join(filters)

            if order_by:
                query += f" ORDER BY {order_by} {order or 'ASC'}"

            # Execute query with parameters
            cursor.execute(query, params)
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


def new_medallists():
    try:
        # Get data from POST request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract the nested input_data
        data = data['input_data']
        medal_code = data.get('medal_code')
        if not medal_code:
            return jsonify({'error': 'Missing required field: Medal Code'}), 400
        code_athlete = data.get('code_athlete')
        if not code_athlete:
            return jsonify({'error': 'Missing required field: Athlete Code'}), 400
        try:
            # Convert medal_code and code_athlete to integers
            medal_code = int(medal_code)
            code_athlete = int(code_athlete)
        except (ValueError, TypeError) as e:
            return jsonify({'error': f'Invalid data type: {str(e)}'}), 400

        # Validate medal_code
        if medal_code not in [1, 2, 3]:
            return jsonify({'error': 'Invalid medal_code. It must be 1, 2, or 3.'}), 400
        # print("Incoming medal code Data:", medal_code) # Debug log

        # Extract values from JSON payload
        medal_date = data.get('medal_date')
        country_code = data.get('country_code')
        team_gender = data.get('team_gender')
        code_team = data.get('code_team')
        discipline = data.get('discipline')
        event = data.get('event')

        # Validate required fields
        if not all([medal_date, country_code, discipline, event]):
            if not medal_date:
                return jsonify({'error': 'Missing required field: Medal Date'}), 400
            if not country_code:
                return jsonify({'error': 'Missing required field: Country Code'}), 400
            if not discipline:
                return jsonify({'error': 'Missing required field: Discipline'}), 400
            return jsonify({'error': 'Missing required field: Event'}), 400

        # print("Incoming JSON Data:", data)  # Debug log

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Validate country_code
                cursor.execute("SELECT 1 FROM Country WHERE country_code = %s", (country_code,))
                if cursor.fetchone() is None:
                    return jsonify({'error': 'Invalid country_code. It does not exist in the Country table.'}), 400

                # Validate code_athlete
                cursor.execute("SELECT 1 FROM Athlete WHERE athlete_code = %s", (code_athlete,))
                if cursor.fetchone() is None:
                    return jsonify({'error': 'Invalid code_athlete. It does not exist in the Athlete table.'}), 400

                # Validate code_team if this is a team event
                if code_team:
                    cursor.execute("SELECT 1 FROM Teams WHERE team_code = %s", (code_team,))
                    if cursor.fetchone() is None:
                        return jsonify({'error': 'Invalid team code. It does not exist in the Team table.'}), 400
                elif code_team is not None:
                    return jsonify({'error': 'Invalid team code. It does not exist in the Team table.'}), 400

                if team_gender is not None:
                    return jsonify({'error': 'Invalid team gender.'}), 400


                # Validate discipline
                cursor.execute("SELECT 1 FROM Discipline WHERE name = %s", (discipline,))
                if cursor.fetchone() is None:
                    return jsonify({'error': 'Invalid discipline. It does not exist in the Discipline table.'}), 400

                # Insert medallist into the database
                query = """
                    INSERT INTO Medallist (medal_date, medal_code, country_code, team_gender, discipline, event, code_athlete, code_team)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                values = (
                    medal_date, medal_code, country_code, team_gender, discipline, event, code_athlete, code_team
                )
                cursor.execute(query, values)
                connection.commit()

                update_countries(cursor, connection)

                return jsonify({'message': 'Medallist created successfully'}), 201

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


def delete_medallists(ID):
    try:
        # Validate required fields
        if not ID:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to delete medallist by ID
                query = "DELETE FROM Medallist WHERE id = %s"
                cursor.execute(query, (ID,))
                connection.commit()

                update_countries(cursor, connection)

                return jsonify({'message': 'Medallist deleted successfully'}), 200

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


def update_medallists(ID):
    try:
        # Get data from PATCH request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        data = data.get('input_data')
        # Extract values from JSON payload
        medal_date = data.get('medal_date')
        medal_code = data.get('medal_code')
        code_athlete = data.get('code_athlete')
        country_code = data.get('country_code')
        discipline = data.get('discipline')
        event = data.get('event')
        team_gender = data.get('team_gender')
        code_team = data.get('code_team')

        # Validate required fields
        if not ID or not medal_code or not code_athlete or not country_code or not discipline or not event or not medal_date:
            return jsonify({'error': 'Missing required fields'}), 400
        if int(medal_code) not in [1, 2, 3]:
            return jsonify({'error': 'Invalid medal_code. It must be 1, 2, or 3.'}), 400

        # Establish database connection
        connection = db_connection()

        if connection.is_connected():
            with connection.cursor(dictionary=True, buffered=True) as cursor:
                # Validate country_code
                cursor.execute("SELECT 1 FROM Country WHERE country_code = %s", (country_code,))
                if cursor.fetchone() is None:
                    return jsonify({'error': 'Invalid country_code. It does not exist in the Country table.'}), 400

                # Validate code_athlete
                cursor.execute("SELECT 1 FROM Athlete WHERE athlete_code = %s", (code_athlete,))
                if cursor.fetchone() is None:
                    return jsonify({'error': 'Invalid code_athlete. It does not exist in the Athlete table.'}), 400

                # Validate code_team if this is a team event
                if code_team:
                    cursor.execute("SELECT 1 FROM Teams WHERE team_code = %s", (code_team,))
                    if cursor.fetchone() is None:
                        return jsonify({'error': 'Invalid code_team. It does not exist in the Team table.'}), 400

                # Validate discipline
                cursor.execute("SELECT 1 FROM Discipline WHERE name = %s", (discipline,))
                if cursor.fetchone() is None:
                    return jsonify({'error': 'Invalid discipline. It does not exist in the Discipline table.'}), 400

                # Validate discipline
                cursor.execute("SELECT 1 FROM Events WHERE event_name = %s", (event,))
                if cursor.fetchone() is None:
                    return jsonify({'error': 'Invalid event. It does not exist in the Events table.'}), 400

                # Check if the medallist exists
                query = "SELECT * FROM Medallist WHERE id = %s"
                cursor.execute(query, (ID,))
                existing_medallist = cursor.fetchone()

                if not existing_medallist:
                    return jsonify({'error': f'No medallist found with ID: {ID}'}), 404

                # Update medallist in the database
                query = """UPDATE Medallist SET medal_date = %s, medal_code = %s, code_athlete = %s, country_code = %s, discipline = %s, event = %s, team_gender = %s, code_team = %s WHERE id = %s"""
                values = (
                    medal_date, medal_code, code_athlete, country_code, discipline, event, team_gender, code_team, ID)
                cursor.execute(query, values)
                connection.commit()

                update_countries(cursor, connection)
                return jsonify({'message': 'Medallist updated successfully'}), 200

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


def update_countries(cursor, connection):
    updateMedalCount = """UPDATE Country
SET 
    gold_medal = (
        SELECT COUNT(DISTINCT CONCAT(event, '-', discipline)) 
        FROM Medallist 
        WHERE country_code = Country.country_code AND medal_code = 1
    ),
    silver_medal = (
        SELECT COUNT(DISTINCT CONCAT(event, '-', discipline)) 
        FROM Medallist 
        WHERE country_code = Country.country_code AND medal_code = 2
    ),
    bronze_medal = (
        SELECT COUNT(DISTINCT CONCAT(event, '-', discipline)) 
        FROM Medallist 
        WHERE country_code = Country.country_code AND medal_code = 3
    );"""
    cursor.execute(updateMedalCount)
    connection.commit()
