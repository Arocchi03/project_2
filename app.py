# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, Response
import pandas as pd
from flask_cors import CORS

# Data base set up
engine = create_engine("sqlite:///data/crime_db.sqlite")

# reflect an existing database into a new model
# Base = automap_base()

# reflect the tables
# Base.prepare(engine, reflect=True)

# Save reference to the table
# Listings = Base.classes.listings
#Crime = Base.classes.crimes
#Areas = Base.classes.comm_areas

# Flask set up
app = Flask(__name__)
CORS(app)



# Routes
@app.route("/airbnb")
def airbnb():

    # Create our session (link) from Python to the DB
    # session = Session(engine)

    # Query for Airbnb data
    airbnb_results = pd.read_sql(""" 
    SELECT * FROM listings;
    """, engine)  
    #session.query(Listings).all()

    # Close the session
    # session.close()

    # Convert into dictionary
    # airbnb_data = airbnb_results

    return Response(airbnb_results.to_json(orient="records"), mimetype="application/json")
    # jsonify(airbnb_data)



@app.route("/crimes")
def crimes():

#     # Create our session (link) from Python to the DB
#     session = Session(engine)

    crime_results = pd.read_sql(""" 
    SELECT c.*, a.community_name FROM crimes as c 
    JOIN comm_areas as a 
    ON c.community_area = a.community_id
    WHERE primary_type = "ARSON";
    """, engine)  

#     # Query for Crime data
#     crime_results = session.query(Crime).all()

#     # Close the session
#     session.close()

#     # Convert into dictionaries
    #crime_data = crime_results

    return Response(crime_results.to_json(orient="records"), mimetype="application/json")


if __name__ == '__main__':
    app.run(debug=True)