import mysql.connector
from settings import db_host, db_password, db_user, db_name
import csv
import ast

try:
    mydb = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        auth_plugin='mysql_native_password'
    )

    mycursor = mydb.cursor()

    mycursor.execute(f"CREATE DATABASE {db_name}")
    print(f"Database {db_name} created")
    if (mydb.is_connected()):
        mycursor.close()
        mydb.close()

    cnx = mysql.connector.connect(
        user=db_user,
        password=db_password,
        host=db_host,
        database=db_name,
        auth_plugin='mysql_native_password')

    cursor = cnx.cursor()

    def executeScriptsFromFile(filename):
        fd = open(filename, 'r')
        sqlFile = fd.read()
        fd.close()

        sqlCommands = sqlFile.split(';')

        for command in sqlCommands:
            try:
                if command.rstrip() != '':
                    cursor.execute(command)
            except ValueError as msg:
                print("Command skipped: ", msg)
    executeScriptsFromFile('./database/schema_test_relational.sql')
    cnx.commit()

    ins = mysql.connector.connect(
        user=db_user,
        password=db_password,
        host=db_host,
        database=db_name,
        auth_plugin='mysql_native_password')

    cursor = ins.cursor()

    def insertData(filename, command):
        with open('./Data/Tables/{}.csv'.format(filename), 'r') as open_file:
            csv_file = csv.reader(open_file, delimiter=',')  # Specify the correct delimiter
            header = next(csv_file)  # Read the header row
            for row in csv_file:
                row = row[0].split(',')
                print(row)
                try:
                    # Execute the query with row values
                    cursor.execute(command, row)
                except Exception as e:
                    print(command)
                    print(row)
                    print(f"Error inserting row {row}: {e}")
                    continue
        ins.commit()
    command = """INSERT INTO Country (gold_medal,silver_medal,bronze_medal,country_code,country_name,country_long) VALUES (%s,%s,%s,%s,%s,%s)"""
    insertData('country', command)
    command = """INSERT INTO Discipline (name,discipline_code,id) VALUES (%s,%s, %s)"""
    insertData('discipline', command)
    command = """INSERT INTO Events (events_code,event_name,url,discipline_code,sport_name) VALUES (%s,%s,%s,%s,%s)"""
    insertData('events', command)
    command = """INSERT INTO Schedule (start_date,end_date,status,discipline_code,event_name,phase,gender,venue,event_code,url) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
    insertData('schedule', command)
    command = """INSERT INTO Athlete (athlete_code,name,gender,country_code,nationality,birth_date) VALUES (%s,%s,%s,%s,%s,%s)  """
    insertData('athlete',command)
    command= """INSERT INTO Coach (coach_code,name,gender,function,country_code,disciplines,birth_date) VALUES (%s,%s,%s,%s,%s,%s,%s) """
    insertData('coach',command)
    command = """INSERT INTO Medallist (id, name, medal_date, medal_code, gender, country_code, code_team, code_athlete, discipline)  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    insertData('medallist',command)
    command = """INSERT INTO Teams (team_code,team_name,team_gender,country_code, discipline_code,num_athletes) VALUES (%s, %s, %s, %s, %s, %s)"""
    insertData('teams_simplified',command)

    def insertData_JoinTable(filename, command):
        with open('./Data/Tables/{}.csv'.format(filename), 'r') as open_file:
            csv_file = csv.reader(open_file, delimiter=',') 
            header = next(csv_file) 

            for line in csv_file:
                try:
                    team_code = line[0].strip() 
                    coach_codes = line[1].strip() if len(line) > 1 else ""  
                    
                   
                    if not coach_codes:
                        # print(f"Skipping line for team {team_code} as second column is empty.")
                        continue
                    
                    coaches = ast.literal_eval(coach_codes) if coach_codes else []

                    for coach_code in coaches:
                        cursor.execute(command, (team_code, coach_code))

                except Exception as e:
                    # print(f"Error processing line {line}: {e}")
                    continue
        ins.commit()
    command = """INSERT INTO Team_Athlete (team_code,athlete_code) VALUES (%s,%s)"""
    insertData_JoinTable('teams_athlete', command)
    command = """INSERT INTO Team_Coach (team_code,coach_code) VALUES (%s,%s)"""
    insertData_JoinTable('teams_coach', command)

except Exception as err:
    print("There was an error creating the database: ", err)
