import mysql.connector
from settings import db_host, db_password, db_user, db_name
import csv


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
    executeScriptsFromFile('./database/schema_test.sql')
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
            csv_file = csv.reader(open_file, delimiter=';')  # Specify the correct delimiter
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
                    break
        ins.commit()
    command = """INSERT INTO Schedule (start_date,end_date,status,discipline_code,event_name,phase,gender,venue,event_code,url) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
    insertData('schedule', command)
    command = """INSERT INTO Discipline (discipline_code,name,id) VALUES (%s,%s, %s)"""
    insertData('discipline', command)

except Exception as err:
    print("There was an error creating the database: ", err)
