from flaskext.mysql import MySQL
from werkzeug.security import generate_password_hash

def init_db(app):
    mysql = MySQL()
    app.config['MYSQL_DATABASE_USER'] = 'root'
    app.config['MYSQL_DATABASE_PASSWORD'] = 'dbpassword' # replace with your database password
    app.config['MYSQL_DATABASE_DB'] = 'rutabaga'
    app.config['MYSQL_DATABASE_HOST'] = 'localhost'
    app.config['TMP_PW'] = 'password'  # replace with your temporary password

    mysql.init_app(app) 
    return mysql

def create_user(username, pw, conn):
    cursor = conn.cursor()
    sql = "INSERT INTO user (user_name, user_password)  VALUES (%s, %s)"
    values = (username, generate_password_hash(pw))
    cursor.execute(sql, values)
    id = cursor.lastrowid
    conn.commit()
    cursor.close()
    set_user_settings(id, conn)
    set_review_assignment(id, conn)

    return id


def set_user_settings(user_id, conn):
    cursor = conn.cursor()
    sql = "INSERT INTO user_setting (user_id)  VALUES (%s)"
    cursor.execute(sql, (user_id))

    sql = "INSERT INTO user_vis_setting (user_id)  VALUES (%s)"
    cursor.execute(sql, (user_id))

    sql = "INSERT INTO user_status (user_id)  VALUES (%s)"
    cursor.execute(sql, (user_id))

    conn.commit()
    cursor.close()

def set_review_assignment(user_id, conn):
    cursor = conn.cursor()
    sql = "INSERT INTO review_assignment (user_id, applicant_id) SELECT %s, id FROM application"
    cursor.execute(sql, (user_id))

    conn.commit()
    cursor.close()






 
