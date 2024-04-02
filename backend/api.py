from app import app
from app import mysql
from utils import get_filename,get_test_filename, FILENOTFOUND
from pymysql.cursors import DictCursor
from flask import jsonify
from flask import  request
from flask import make_response, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import send_from_directory
from auth import (authenticate_user, AuthenticationError)
from werkzeug.security import generate_password_hash
from process_interaction import process_interaction

import time


@app.route('/auth/login', methods=['POST'])
def login_api():
	"""Login user"""
	try:
		username = request.json.get('username', None)
		password = request.json.get('password', None)

		access_token, refresh_token, user_id = authenticate_user(username, password)
		return make_response(jsonify({
			'accessToken': access_token,
			'refreshToken': refresh_token,
			'userId': user_id
		}))

	except AuthenticationError as error:
		app.looger.error('authentication error: %s', error)
		abort(403)


@app.route('/userinfo', methods=['GET'])
@jwt_required()
def user_info():
	conn = None
	cursor = None
	try:
		# get current user
		# user = get_authenticated_user()
		user_id = get_jwt_identity()
		# print(user_id)

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT user_id, user_name, is_experiment FROM user WHERE user_id=%s", user_id)
		row = cursor.fetchone()
		resp = jsonify(row)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/userstatus', methods=['GET'])
@jwt_required()
def user_status():
	conn = None
	cursor = None
	try:
		# get current user
		# user = get_authenticated_user()
		user_id = get_jwt_identity()
	
		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)

		cursor.execute("SELECT current_id, toured, finished,summary_finished,summarytoured FROM user_status WHERE user_id=%s", user_id)
		row = cursor.fetchone()
		resp = jsonify(row)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/getapplications', methods=['GET'])
@jwt_required()
def get_applications():
	"""Get application IDs and names"""
	try:
		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT `id`, `NAME_LAST`, `NAME_FIRST` FROM application")
		rows = cursor.fetchall()
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/getnumapplications', methods=['GET'])
@jwt_required()
def get_num_applications():
	"""Get the total number of applications"""
	try:
		user_id = get_jwt_identity()
		conn = mysql.connect()
		cursor = conn.cursor()
		cursor.execute("SELECT COUNT(*) FROM application")
		totalNum = cursor.fetchone()
		cursor.execute("SELECT COUNT(*) FROM rating WHERE user_id=%s AND recommendation IS NOT NULL", user_id)
		reviewedNum = cursor.fetchone()
		resp = jsonify(totalNum, reviewedNum)
		# print(row)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/userapplications', methods=['GET'])
@jwt_required()
def user_applications():
	"""Get assigned application IDs of the current user"""
	conn = None
	cursor = None
	try:
		# get current user
		# user = get_authenticated_user()
		user_id = get_jwt_identity()	

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT applicant_id, viewed FROM review_assignment WHERE user_id=%s ORDER BY applicant_id;", user_id)
		rows = cursor.fetchall()
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/applications/<int:id>', methods=['GET'])
@jwt_required()
def get_application(id):
	"""Get application by id"""
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		id = conn.escape(id)
		cursor.execute("SELECT * FROM application WHERE id=%s", id)
		row = cursor.fetchone()
		resp = jsonify(row)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



@app.route('/getusersetting', methods=['GET'])
@jwt_required()
def user_setting():
	"""Get user setting"""
	conn = None
	cursor = None
	try:
		# get current user
		# user = get_authenticated_user()
		user_id =  get_jwt_identity()

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT * FROM user_setting WHERE user_id=%s", user_id)
		rows = cursor.fetchall()
		# print(rows)
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/getuservissetting', methods=['GET'])
@jwt_required()
def user_vis_setting():
	"""Get user scatterplot setting"""
	conn = None
	cursor = None
	try:
		# get current user
		# user = get_authenticated_user()
		user_id =  get_jwt_identity()

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT * FROM user_vis_setting WHERE user_id=%s", user_id)
		rows = cursor.fetchall()
		# print(rows)
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/comments/<int:id>', methods=['GET'])
@jwt_required()
def get_comments(id):
	"""Get the current user's comments by application id"""
	conn = None
	cursor = None
	try:
		# user = get_authenticated_user()
		user_id = get_jwt_identity()	

		conn = mysql.connect()
		id = conn.escape(id)
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT add_timestamp, content FROM comment WHERE user_id=%s AND applicant_id=%s", (user_id,id))
		rows = cursor.fetchall()
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/allcomments/<int:id>', methods=['GET'])
@jwt_required()
def get_allcomments(id):
	"""Get the applicant'd comments from all users"""
	conn = None
	cursor = None
	try:
		# user = get_authenticated_user()
		# user_id = get_jwt_identity()	
		conn = mysql.connect()
		id = conn.escape(id)
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT comment.user_id as user_id, last_name, first_name, add_timestamp, content FROM comment JOIN user ON comment.user_id=user.user_id WHERE applicant_id=%s ORDER BY add_timestamp", (id))
		rows = cursor.fetchall()
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



@app.route('/ratings/<int:id>', methods=['GET'])
@jwt_required()
def get_ratings(id):
	"""Get the current user's ratings by application id"""
	conn = None
	cursor = None
	try:
		# user = get_authenticated_user()
		user_id = get_jwt_identity()	

		conn = mysql.connect()
		id = conn.escape(id)
		cursor = conn.cursor(DictCursor)
		cursor.execute("SELECT * FROM rating WHERE user_id=%s AND applicant_id=%s", (user_id,id))
		row = cursor.fetchone()
		resp = jsonify(row)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/addcomment', methods=['POST'])
@jwt_required()
def add_comment():
	"""Add a new comment from a user on an applicant"""
	conn = None
	cursor = None
	try:
		# user = get_authenticated_user()
		user_id = get_jwt_identity()	
		comment = request.json
		# print(comment)

		applicant_id = comment['applicant_id']
		content = comment['content']
		add_timestamp = comment['add_timestamp']


		conn = mysql.connect()

		cursor = conn.cursor(DictCursor)
		sql = "INSERT INTO comment (user_id, applicant_id, add_timestamp, content) VALUES ( %s, %s, %s, %s)"
		cursor.execute(sql, (user_id,applicant_id, add_timestamp, content))
		conn.commit()
		resp = jsonify('Comment added successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/removecomment', methods=['PUT'])
@jwt_required()
def remove_comment():
	"""Remove a comment from a user on an applicant"""
	conn = None
	cursor = None
	try:
		content = request.json.get('content', None)
		applicant_id = request.json.get('applicant_id', None)
		user_id = get_jwt_identity()

		conn = mysql.connect()
	
		cursor = conn.cursor(DictCursor)

		sql = "DELETE FROM comment WHERE content=%s and applicant_id=%s and user_id=%s"
		cursor.execute(sql, (content, applicant_id, user_id))
		conn.commit()
		resp = jsonify('Comment removed successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



@app.route('/updaterating/<string:field>', methods=['POST'])
@jwt_required()
def update_rating(field):
	"""Add/update ratings for the current user on a applicant"""
	conn = None
	cursor = None
	try:
		# user = get_authenticated_user()
		user_id = get_jwt_identity()	
		rating = request.json
		# print(rating)
		applicant_id = rating['applicant_id']
		value = rating[field]
		conn = mysql.connect()
		applicant_id = conn.escape(applicant_id)
		value = conn.escape(value)
		page = rating['page']
	
	
		cursor = conn.cursor(DictCursor)
		sql = "SELECT * From rating WHERE user_id=%s AND applicant_id=%s"
	
		cursor.execute(sql, (user_id,applicant_id))
		row = cursor.fetchone()
	
		if row: # record exists, update the exsiting one
			if field == "LOR_strength":
				updatesql = "UPDATE rating SET LOR_strength  = %s WHERE user_id=%s AND applicant_id=%s"
			if field == "academic":
				updatesql = "UPDATE rating SET academic  = %s WHERE user_id=%s AND applicant_id=%s"
			if field == "activities":
				updatesql = "UPDATE rating SET activities  = %s WHERE user_id=%s AND applicant_id=%s"
			if field == "communication":
				updatesql = "UPDATE rating SET communication  = %s WHERE user_id=%s AND applicant_id=%s"
			if field == "recommendation":
				updatesql = "UPDATE rating SET recommendation  = %s WHERE user_id=%s AND applicant_id=%s"
			cursor.execute(updatesql, (value,  user_id, applicant_id))
			
			conn.commit()
			resp = jsonify('Ratings updated successfully!')
		else: # add new record
			# insertsql = "INSERT INTO rating (user_id, applicant_id, TA, course, curiosity, research, program_fit, communication, recommendation ) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s)"
			insertsql = "INSERT INTO rating (user_id, applicant_id, {column} ) VALUES (%s, %s, %s)"
			cursor.execute(insertsql.format(column=field), (user_id, applicant_id, value))
			conn.commit()
			resp = jsonify('Ratings added successfully!')
		
		insertsql = "INSERT INTO rating_history (user_id, applicant_id, dimension, rating, page) VALUES (%s, %s, %s, %s, %s)"
		cursor.execute(insertsql, (user_id, applicant_id, field, value, page))
		conn.commit()

		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/updatereviewed/<int:id>', methods=['PUT'])
@jwt_required()
def update_reviewed(id):
	"""Update the current user's review status on the applicant identified by id"""
	conn = None
	cursor = None
	try:
		# user = get_authenticated_user()
		user_id = get_jwt_identity()	

		conn = mysql.connect()
		id = conn.escape(id)
		cursor = conn.cursor(DictCursor)
		cursor.execute("UPDATE review_assignment SET viewed = true WHERE user_id=%s AND applicant_id=%s", (user_id, id))
		conn.commit()
		resp = jsonify('Review status updated successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



@app.route('/updateuservissetting', methods=['put'])
@jwt_required()
def update_vissetting():
	"""Update user scatterplot setting"""
	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	

		setting = request.json 
		

		conn = mysql.connect()
		cursor = conn.cursor()
		sql = "UPDATE user_vis_setting SET `xVar`=%s, `yVar`=%s WHERE user_id=%s"
		cursor.execute(sql, (setting['xVar'], setting['yVar'], user_id))
		conn.commit()
		resp = jsonify('User vis setting  updated successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/updateuserstatus', methods=['PUT'])
@jwt_required()
def update_userstatus():
	"""Update the current user's review status on the applicant identified by id"""
	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	
		current_id = request.json.get('current_id', None)

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("UPDATE user_status SET current_id = %s WHERE user_id=%s", (current_id, user_id ))
		conn.commit()
		resp = jsonify('User status updated successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()




@app.route('/pdffile/<int:id>/<string:doctype>', methods=['GET'])
@jwt_required()
def get_pdf(id, doctype):
	"""Update the current user's review status on the applicant identified by id"""
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor()
		# cursor.execute("SELECT XACT_ID FROM application WHERE id=%s ", (id))

		# XACT_ID = cursor.fetchone()[0]
	
		file_path, file_name = get_filename(doctype, id)

		# file_path, file_name = get_test_filename()

		return send_from_directory(file_path, file_name)
	except Exception as e:
		print(e)
	# finally:
	# 	cursor.close() 
	# 	conn.close()


@app.route('/addinteraction', methods=['POST'])
@jwt_required()
def add_interaction():
	"""Add a new interaction from a user on an applicant"""
	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	
		interaction = request.json
	

		applicant_id = interaction['applicantId']
		doc_type = interaction['pdfType']
		interaction_type = interaction['interactionType']
		element = interaction['element']
		timestamp = interaction['timeStamp']

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		sql = "INSERT INTO user_interaction (user_id, applicant_id, doc_type, interaction_type, element, timestamp) VALUES ( %s, %s, %s, %s, %s, %s)"
		cursor.execute(sql, (user_id,applicant_id, doc_type, interaction_type, element, timestamp))
		conn.commit()
		resp = jsonify('Interaction added successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/addvisinteraction', methods=['POST'])
@jwt_required()
def add_visinteraction():
	"""Add a new interaction from a user on the Summary Page"""
	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	
		interaction = request.json
		# print(interaction)
	
		applicant_id = interaction['applicantId']
		interaction_type = interaction['interactionType']
		element = interaction['element']
		recommendation = interaction['recommendation']
		focus_time = interaction['focusTime']
		timestamp = interaction['timeStamp']

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		sql = "INSERT INTO user_vis_interaction (user_id, applicant_id, interaction_type, element, recommendation, focus_time, timestamp) VALUES ( %s, %s, %s, %s, %s, %s,%s)"
		cursor.execute(sql, (user_id,applicant_id, interaction_type, element, recommendation, focus_time, timestamp))
		conn.commit()
		resp = jsonify('VIS Interaction added successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



@app.route('/userrated', methods=['GET'])
@jwt_required()
def user_rated():
	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()
		# print(user_id)

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)

		joinSQL= "SELECT * FROM rating as r JOIN application as a ON r.applicant_id=a.id WHERE r.user_id=%s and r.recommendation is not null;"
		# cursor.execute("SELECT * FROM rating WHERE user_id=%s and recommendation is not null;", user_id)
		cursor.execute(joinSQL, user_id)


		rows = cursor.fetchall()
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/focustime', methods=['GET'])
@jwt_required()
def user_focustime():
	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()
		# print(user_id)

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)

		# if there are no new logs since last processed time, return the current times
		# otherwise, process logs and write to db and return the updated ones.
		cursor.execute("SELECT * FROM focus_time WHERE user_id=%s", user_id)
	
		attention = cursor.fetchall()
	
		cursor.execute("SELECT MAX(process_time) FROM focus_time WHERE user_id=%s", user_id)
		last_process_time = cursor.fetchone()['MAX(process_time)']
	
		cursor.execute("SELECT MAX(timestamp) FROM user_interaction WHERE user_id=%s", user_id)
		last_interaction_time = cursor.fetchone()['MAX(timestamp)']
		
		

		# print(last_interaction_time, last_process_time)
		
		if len(attention) == 0 or last_interaction_time is None or last_interaction_time > last_process_time :
			# get logs
			# cursor.execute("SELECT * FROM user_interaction WHERE user_id=%s ORDER BY timestamp ASC;", user_id)
			cursor.execute("SELECT * FROM user_interaction WHERE user_id=%s and applicant_id != 0 ORDER BY timestamp ASC;", user_id)
			logs = cursor.fetchall()

			attention = process_interaction(logs)
		
			# insert to attention table 
			
			if(attention is not None):
		
				for applicant_id, val in attention.items():
					# print("val", applicant_id, val)
					sql = "SELECT * FROM focus_time WHERE user_id=%s and applicant_id=%s";
					cursor.execute(sql, (user_id,applicant_id))
					res = cursor.fetchone()
					if res is None:  # insert new row
						# print("create new attention")
						sql = "INSERT INTO focus_time (user_id, applicant_id, total_time, Resume, PS, LOR1,LOR2, transcripts, process_time)\
							VALUES( %s, %s, %s, %s, %s, %s,  %s, %s, %s);"
						cursor.execute(sql, (user_id, applicant_id, val['total'], val['Resume'],val['PS'], val['LOR1'], val['LOR2'], \
										val['Transcripts'],  int(time.time())))
					else:
						# print("update attention")
						sql = "UPDATE focus_time SET total_time=%s, Resume=%s, PS=%s, LOR1=%s,LOR2=%s, transcripts=%s, \
							 process_time=%s where user_id=%s and applicant_id=%s;"
						cursor.execute(sql, (val['total'], val['Resume'],val['PS'], val['LOR1'], val['LOR2'],\
										val['Transcripts'], int(time.time()), user_id, applicant_id,))
				

				conn.commit()
				cursor.execute("SELECT * FROM focus_time WHERE user_id=%s", user_id)
				attention = cursor.fetchall()
		
		resp = jsonify(attention)
	
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



		

@app.route('/updatetourstatus', methods=['PUT'])
@jwt_required()
def update_tourstatus():

	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("UPDATE user_status SET toured = 1 WHERE user_id=%s", (user_id ))
		conn.commit()
		resp = jsonify('User status updated successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/updatefinished', methods=['PUT'])
@jwt_required()
def update_finished():

	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("UPDATE user_status SET finished = 1 WHERE user_id=%s", (user_id ))
		conn.commit()
		resp = jsonify('User status updated successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/updatesummarytourstatus', methods=['PUT'])
@jwt_required()
def update_summarytourstatus():

	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("UPDATE user_status SET summarytoured = 1 WHERE user_id=%s", (user_id ))
		conn.commit()
		resp = jsonify('User status updated successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/updateuservisitstatus', methods=['PUT'])
@jwt_required()
def update_user_visitstatus():
	"""Update the current user's visit status of my summary page"""
	conn = None
	cursor = None
	try:
		user_id = get_jwt_identity()	
		current_id = request.json.get('current_id', None)

		conn = mysql.connect()
		cursor = conn.cursor(DictCursor)
		cursor.execute("UPDATE user_status SET summary_finished = 1 WHERE user_id=%s", (user_id ))
		conn.commit()
		resp = jsonify('User visit status updated successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp

if __name__ == "__main__":

	app.run()