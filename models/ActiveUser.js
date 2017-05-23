'use strict' // to make JavaScript strict syntactically

var bcrypt = require("bcrypt"); // password encryption module 
var MongoClient = require("mongodb").MongoClient; // database module

class ActiveUsers {

	constructor() { 
		this.db = "mongodb://localhost:27017/TinDriveUsers";
		this.collection = "ActiveUsers";		
	}

	removeUser(name, callBack) {
		MongoClient.connect(this.db, function(err, db) {



		});
	}

	queryUser(name, callBackA, callBackB) {
		MongoClient.connect(this.db, function(err, db) {
			if (err) console.log("Failed to Connect to database...");
			else {
				db.collection(this.collection).findOne({"name": name}, function(err, doc) {
					if (err) console.log("Error in finding the name in the databse...");
					else {
						if (doc === null) {
							callBackA();
						} else {
							callBackB();
						}
						this.db.close();
					}
				});;
			}
		});
	}

}


module.exports = ActiveUsers;