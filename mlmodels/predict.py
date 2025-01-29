from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_pymongo import PyMongo
import datetime

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)
@app.route("/send-data", methods=["POST"])
def sendData():
    deal = {
        "from_message": 3247832956,  # Ensure it's a valid data type (string if needed)
        "vendor_phone": 2354862736,  # Convert to string if necessary
        "agreed_price": 32487,
        "item": "wood",
        "status": "confirmed",
        "timestamp": datetime.datetime.now(),  # Use datetime instead of pandas
    }

    deals_collection.insert_one(deal)
    return jsonify({"message": "Deal inserted successfully!"}), 201  # Return status 201 for created

if __name__ == "__main__":
    app.run(debug=True)
