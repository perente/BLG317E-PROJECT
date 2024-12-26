from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector
from mysql.connector import Error
from settings import db_user,db_password, db_port, db_host,db_name  
from schedules import get_schedules, new_schedules, delete_schedules, update_schedule, update_schedules
from disciplines import  get_disciplines, delete_disciplines, create_discipline, update_discipline
from events import get_events, delete_event, update_events, new_events
from athletes import get_athletes, delete_athletes, new_athletes, update_athlete
from coaches import get_coaches, delete_coaches, new_coaches, update_coach
from countries import get_countries, delete_country, update_countries, new_countries
from medallist import get_medallists, new_medallists, delete_medallists
from teams import new_team, get_teams, delete_team, update_team , delete_TeamsAthlete, get_TeamsAthlete
from leaderboard import get_leaderboard, get_country_medals_on_disciplines

connection = mysql.connector.connect(host=db_host, database=db_name, port = db_port, user=db_user, password=db_password)    


app = Flask(__name__)
CORS(app, support_credentials=True)


def db_connection():
    connection = mysql.connector.connect(host=db_host, database=db_name, port = db_port, user=db_user, password=db_password)
    return connection

# example get request
@app.route('/schedules', methods=['GET'])
def schedules():
    return get_schedules()

@app.route('/schedules', methods=['POST'])
def create_schedule():
    return new_schedules()
@app.route('/schedules/<int:schedule_id>', methods=['PATCH'])
def updateSchedule(schedule_id):
    return update_schedule(schedule_id)

@app.route('/schedules/<int:schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    return delete_schedules(schedule_id)

@app.route('/update_schedule_group', methods=['PATCH'])
def update_schedule_group():
    return update_schedules()


@app.route('/disciplines', methods=['GET'])
def disciplines():
    return get_disciplines()

@app.route('/disciplines/<int:discipline_id>', methods=['DELETE'])
def delete_discipline(discipline_id):
    return delete_disciplines(discipline_id) 

@app.route('/disciplines', methods=['POST'])
def new_discipline():
    return create_discipline()

@app.route('/disciplines/<int:discipline_id>', methods=['PATCH'])
def updateDiscipline(discipline_id):
    return update_discipline(discipline_id)

@app.route('/countries', methods=['GET'])
def countries():
    return get_countries()

@app.route('/countries/<string:code>', methods=['DELETE'])
def delete_countries(code):
    return delete_country(code)

@app.route('/countries', methods=['POST'])
def new_country():
    return new_countries()

@app.route('/countries/<string:code>', methods=['PATCH'])
def update_country(code):
    return update_countries(code)

@app.route('/events', methods=['GET'])
def events():
    return get_events()

@app.route('/events/<int:events_code>', methods=['DELETE'])
def delete_events(events_code):
    return delete_event(events_code)

@app.route('/countries', methods=['POST'])
def new_event():
    return new_events()

@app.route('/events/<int:events_code>', methods=['PATCH'])
def update_event(events_code):
    return update_events(events_code)

@app.route('/teams', methods=['GET'])
def teams():
    return get_teams()

@app.route('/teams', methods=['POST'])
def create_teams():
    return new_team()

@app.route('/teams/<string:team_code>', methods=['DELETE'])
def delete_team_route(team_code):
    return delete_team(team_code)


@app.route('/teams/<string:team_code>', methods=['PATCH'])
def update_team_route(team_code):
    return update_team(team_code)

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

@app.route('/medallists', methods=['GET'])
def get_medallist():
    return get_medallists()

@app.route('/medallists', methods=['POST'])
def create_medallist():
    return new_medallists()

@app.route('/medallists/<int:medallist_id>', methods=['DELETE'])
def delete_medallist(medallist_id):
    return delete_medallists(medallist_id)

@app.route('/athletes', methods=['GET'])
def athletes():
    return get_athletes()

@app.route('/athletes/<int:athlete_id>', methods=['DELETE'])
def delete_athlete(athlete_id):
    return delete_athletes(athlete_id)

@app.route('/athletes', methods=['POST'])
def create_athlete():
    return new_athletes()

@app.route('/athletes/<int:athlete_id>', methods=['PATCH'])
def updateAthlete(athlete_id):
    return update_athlete(athlete_id)

@app.route('/coaches', methods=['GET'])
def coaches():
    return get_coaches()

@app.route('/coaches/<int:coach_id>', methods=['DELETE'])
def delete_coach(coach_id):
    return delete_coaches(coach_id)

@app.route('/coaches', methods=['POST'])
def create_coach():
    return new_coaches()

@app.route('/coaches/<int:coach_id>', methods=['PATCH'])
def updateCoach(coach_id):
    return update_coach(coach_id)

@app.route('/teams_athlete', methods=['GET'])
def get_team_athletes_route():
    return get_TeamsAthlete()

@app.route('/teams_athlete', methods=['DELETE'])
def delete_teams_athlete_route():
    return delete_TeamsAthlete()


@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    return get_leaderboard()

@app.route('/leaderboard/<string:country_code>', methods=['GET'])
def leaderboard_country(country_code):
    return get_country_medals_on_disciplines(country_code)





if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
