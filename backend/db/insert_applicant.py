import mysql.connector
import csv


INPUT_FILE = "applicants_profile.csv"

def init_db():
    """ Connect to the database"""
    conn = mysql.connector.connect(
        host ="localhost",
        user ="root",
        passwd ='dbpassword', # replace with your database password
        database = "rutabaga"
        
    )
    return conn

def insert_applicant():
    """Read spreadsheet info and insert into applicaiton table"""
    db = init_db()
    cursor = db.cursor()
    with open(INPUT_FILE, 'r') as f:
        csv_reader = csv.reader(f)
        next(csv_reader) # skip header
        for values in csv_reader:
            for i in range(len(values)):
                if values[i] == '':
                    values[i] = None 
            params = ['%s' for item in values]
            sql = 'INSERT INTO application (`NAME_LAST`, `NAME_FIRST`, `SCHOOL_CODE`, `GPA`, `CLASS_RANK`, `CLASS_SIZE`,\
            `SAT`, `SAT_MATH`, `SAT_RW`, `GENDER`, `RACE`) VALUES (%s);' % ','.join(params)
            # print(sql)
            print(values)
            cursor.execute(sql, values)
    db.commit()
    cursor.close()
    db.close()

if __name__ == "__main__":
    insert_applicant()



   
