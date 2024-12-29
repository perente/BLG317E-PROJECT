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
            discipline = request.args.get('discipline')

            print(athlete_code, name, gender, country_code, nationality, birth_date)

            # Base query with medal count
            query = """
                SELECT 
                    Athlete.*, 
                    Country.country_name, 
                    GROUP_CONCAT(Athlete_Disciplines.discipline) AS disciplines,
                    SUM(CASE WHEN Medallist.medal_code = 1 THEN 1 ELSE 0 END) AS gold_medals,
                    SUM(CASE WHEN Medallist.medal_code = 2 THEN 1 ELSE 0 END) AS silver_medals,
                    SUM(CASE WHEN Medallist.medal_code = 3 THEN 1 ELSE 0 END) AS bronze_medals
                FROM Athlete
                LEFT JOIN Country ON Athlete.country_code = Country.country_code
                LEFT JOIN Athlete_Disciplines ON Athlete.athlete_code = Athlete_Disciplines.athlete_code
                LEFT JOIN Medallist ON Athlete.athlete_code = Medallist.code_athlete
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
                filters.append("Athlete.nationality LIKE %s")
                params.append(f"%{nationality}%")

            if birth_date:
                filters.append("Athlete.birth_date >= %s")
                params.append(birth_date)

            if discipline:
                filters.append("Athlete.athlete_code IN (SELECT athlete_code FROM Athlete_Disciplines WHERE discipline = %s)")
                params.append(discipline)

            # Add filters to query
            if filters:
                query += " WHERE " + " AND ".join(filters)

            query += """
                GROUP BY Athlete.athlete_code, Country.country_name
            """

            # Order by clause
            if order_by:
                query += f" ORDER BY {order_by} {order or 'ASC'}"

            print("Query:", query)
            print("Params:", params)

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


def delete_athletes(athleteID):
    try:
        # Validate required fields
        if not athleteID:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()  # Ensure this function is defined elsewhere

        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                # Query to delete ATHLETE by athleteID
                query = "DELETE FROM Athlete WHERE athlete_code = %s"
                cursor.execute(query, (athleteID,))
                connection.commit()

                return jsonify({'message': 'Athlete deleted successfully'}), 200

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

def new_athletes():
    try:
        # Get data from POST request
        data = request.get_json()
        country_data = ""

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        athlete_code = data.get('athlete_code')
        name = data.get('name')
        gender = data.get('gender')
        country_code = data.get('country_code')
        nationality = data.get('nationality')
        birth_date = data.get('birth_date')
        disciplines = data.get('disciplines', [])


        # Validate required fields
        if not all([athlete_code,gender, name, country_code, nationality,birth_date]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()  # Ensure this function is defined elsewhere

        if connection.is_connected():          
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute("START TRANSACTION")
                # Query to fetch country details by countryID
                query = "SELECT * FROM Country WHERE country_code = %s"
                cursor.execute(query, (country_code,))

                # Fetch the country data
                country_data = cursor.fetchone()
                if country_data:
                    pass
                else:
                    cursor.execute("ROLLBACK")
                    return jsonify({'error': f'No country found with countryID: {country_code}'}), 404

        
                # Insert athlete into the database
                query = """INSERT INTO Athlete (athlete_code,name,gender,country_code,nationality,birth_date) VALUES (%s,%s,%s,%s,%s,%s)"""
                values = (athlete_code, name, gender, country_data['country_code'], nationality,
                          birth_date)
                cursor.execute(query, values)

                # Insert disciplines into the Athlete_Disciplines table
                if disciplines:
                    for discipline in disciplines:
                        cursor.execute("INSERT INTO Athlete_Disciplines (athlete_code, discipline) VALUES (%s, %s)",
                                       (athlete_code, discipline))

                connection.commit()

                return jsonify({'message': 'Athlete created successfully'}), 201

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except mysql.connector.Error as e:
        connection.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        connection.rollback()
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        # Ensure the connection is closed properly
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


def update_athlete(athleteID):
    try:
        # Get data from PATCH request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid input: No JSON payload provided'}), 400

        # Extract values from JSON payload
        athlete_code = data.get('athlete_code')
        name = data.get('name')
        gender = data.get('gender')
        country_code = data.get('country_code')
        nationality = data.get('nationality')
        birth_date = data.get('birth_date')
        disciplines = data.get('disciplines', [])


        # Validate required fields
        if not athleteID:
            return jsonify({'error': 'Missing required fields'}), 400

        # Establish database connection
        connection = db_connection()

        country_data = ""
        if connection.is_connected():
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute("START TRANSACTION")
                # Query to fetch country details by countryID
                query = "SELECT * FROM Country WHERE country_code = %s"
                cursor.execute(query, (country_code,))

                # Fetch the country data
                country_data = cursor.fetchone()
                if country_data:
                    pass
                else:
                    cursor.execute("ROLLBACK")
                    return jsonify({'error': f'No country found with country_code: {country_code}'}), 404


                # Update athlete in the database
                query = """UPDATE Athlete SET name = %s, gender = %s, country_code = %s, nationality = %s, birth_date = %s WHERE athlete_code = %s"""
                values = (name, gender, country_code,
                          nationality, birth_date,athleteID)
                cursor.execute(query, values)

                # Update disciplines
                cursor.execute("DELETE FROM Athlete_Disciplines WHERE athlete_code = %s", (athleteID,))
                for discipline in disciplines:
                    cursor.execute("INSERT INTO Athlete_Disciplines (athlete_code, discipline) VALUES (%s, %s)", (athleteID, discipline))



                connection.commit()

                return jsonify({'message': 'Athlete updated successfully'}), 200

        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except mysql.connector.Error as e:
        connection.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    except Exception as e:
        connection.rollback()
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

    finally:
        # Ensure the connection is closed properly
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()