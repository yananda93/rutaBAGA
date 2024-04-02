"""
Authentication Functions
"""

from app import mysql, app
import logging
from pymysql.cursors import DictCursor
from functools import wraps
from flask import abort
from werkzeug.security import  check_password_hash
from flask_jwt_extended import (
    create_access_token, create_refresh_token, get_jwt_identity,
)
from db import create_user


class AuthenticationError(Exception):
    """Base Authentication Exception"""
    def __init__(self, msg=None):
        self.msg = msg

    def __str__(self):
        return self.__class__.__name__ + '(' + str(self.msg) + ')'


class InvalidCredentials(AuthenticationError):
    """Invalid username/password"""


class AccessDenied(AuthenticationError):
    """Access is denied"""


class UserNotFound(AuthenticationError):
    """User identity not found"""


def authenticate_user(username, password):
    """
    Authenticate a user
    """
    conn = mysql.connect()
    cursor = conn.cursor(DictCursor)
    cursor.execute("SELECT * FROM user")
    users = cursor.fetchall()

    # check if the user exist, if not create one. 
    for user in users:
        if username == user['user_name'] and check_password_hash(user['user_password'], password):  
            cursor.close() 
            conn.close()
            access_token = create_access_token(identity=user['user_id'], expires_delta=False)
            refresh_token = create_refresh_token(identity=user['user_id'])
            user_id = user['user_id']
            return (
                access_token,
                refresh_token,
                user_id
            )
    # user does not exist yet, check if the pw is correct

    if app.config['TMP_PW']== password: 

        # create a new user
        user_id = create_user(username, app.config['TMP_PW'], conn)
        access_token = create_access_token(identity=user_id, expires_delta=False)
        refresh_token = create_refresh_token(identity=user_id)
        return (
            access_token,
            refresh_token,
            user_id
        )
        
    cursor.close()
    conn.close()
    raise InvalidCredentials()





