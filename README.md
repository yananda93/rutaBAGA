## How to run this app
1. Create Database
    - Install MySQL
    - Use `backend/db.sql` to create the database and tables
    - Run `python backend/db/insert_applicant.py` to insert application profiles in the corresponding database table.

2. Run Backend
    - Navigate to the `backend` directory, create a new virtual environment: `python3 -m venv venv`
    - Activate the virtual environment:
        - macOS/Linux: `source venv/bin/activate`
        - Windows: `.venv\Scripts\activate`
    - Install required pacakeges :  `pip install -r requirments.txt`
    - Run the server locally: `python app.py`

2. Run Frontend
    - Install npm and Angular (v 11) 
    - Navigate to the `frontend` directory and run `npm install` to install modules.
    - Run `ng serve` and navigate to http://localhost:4200/ in your browser to access the app.