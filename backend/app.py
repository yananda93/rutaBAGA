from flask import Flask, Response, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db import init_db
import json


app = Flask(__name__)
app.config.from_file('config.json',load=json.load)
jwt = JWTManager(app)

mysql = init_db(app)

CORS(app)

print("-------------------------app created-----------------------------")
