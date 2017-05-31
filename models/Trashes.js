'use strict' // to make JavaScript strictly typed

var MongoClient = require("mongodb").MongoClient; // mongodb module

// Represents the Trashs collection which contains user's directory of trashes
class Trashes {

	constructor() {
		this.db = "mongodb://localhost:27017/TinDriveUsers"; // link which you use to connect to mongo db database
		this.collection = "Trashes"; // name of the collection
	}

	// upsert means updating the existing document, and if the document doesn't exist it gets updated
	upsert(userTrash, successCallBack, failureCallBack) {		
		var self = this; // the keyword "this" has different meaning in different scopes
		MongoClient.connect(this.db, function(err, db) {
			if (err) {
				console.log("Error in finding the name in the database...");
			} else {
				db.collection(self.collection).update({"name": userTrash.name}, userTrash, {upsert: true}, function(err, result) {
					// the logic of what happens upon success or failure gets passed on through the successCallBack and failureCallBack functions
					if (err) {
						console.log(err);
						console.log("Error in updating the trash directory...");
						if (failureCallBack) { // a check to see if the user provided the failureCallBack, if the user of this class didn't then it would be undefined
							failureCallBack(); // invoke the failure callBack function specified by the class using this object, where the class passes the function in
						}
					} else {
						if (successCallBack) { // a check to see if the user provided the successCallBack, if the user of this class didn't then it would be undefined
							successCallBack(); // invoke the successCallBack function specified by the class using this object, when the class passes the function in
						}
					}
					db.close(); // always close the database in the end
				});
			}
		});
	}

	// takes in the user name and finds the users trash directory from the Trashes collection
	query(name, successCallBack, failureCallBack) {
		var self = this; // the keyword "this" has different meaning in different scopes
		MongoClient.connect(this.db, function(err, db) {  // connects to the db using the this.db attribute
			if (err) {
				console.log("Error in finding the name in the database...");
			} else {
				db.collection(self.collection).findOne({"name": name}, function(err, doc) {
					// the logic of what happens upon success or failure gets passed on through the successCallBack and failureCallBack functions
					if (err) {
						console.log("Error in finding the user's trash...");
						if (failureCallBack) { // a check to see if the user provided the failureCallBack, if the user of this class didn't then it would be undefined
							failureCallBack(); // invoke the failure callBack function specified by the class using this object, where the class passes the function in
						}
					} else {
						if (successCallBack) { // a check to see if the user provided the successCallBack, if the user of this class didn't then it would be undefined
							// successCallBack function which will be passed as a parameter when query method is invoked in the controller will be using the doc parameter supplied by the query method
							// which gets the doc from the mongodb findOne method
							successCallBack(doc); // invoke the successCallBack function specified by the class using this object, when the class passes the function in
						}
					}
					db.close(); // always close the database in the end
				});
			}
		});
	}

	// finds trashes for all the users present and returns a cursor which points to the objects in mongodb
	queryAll(successCallBack, failureCallBack) {
		var self = this; // the keyword "this" has different meaning in different scopes
		MongoClient.connect(this.db, function(err, db) { // connects to the db using the this.db attribute
			// the logic of what happens upon success or failure gets passed on through the successCallBack and failureCallBack functions
			if (err) {
				console.log("Error in finding the name in the database...");
			} else {
				db.collection(self.collection).find({}, function(err, cursor) { // call back function returns the cursor
					// the logic of what happens upon success or failure gets passed on through the successCallBack and failureCallBack functions
					if (err) {
						console.log("Error in finding the user's trash...");
						if (failureCallBack) { // checks whether the failureCallBack is undefined or not, it will be undefined if the user hasn't provided any function through the parameter when this function was invoked
							failureCallBack();
						}
					} else {
						if (successCallBack) { // checks whether the successCallBack is undefined or not, it will be undefined if the user hasn't provided any function through the parameter when this function was invoked
							successCallBack(cursor); // we pass in the cursor that mongodb returned into the successCallBack function that was provided through the param, this successCallBack will use the cursor however it wishes to, as this class doesn't
													// dictate the logic of the successCallBack function, but the class which contains the Trashes object in a composition relationship gets to do what it wants using the cursor information
						}
					}
					db.close();
				});
			}
		});
	}

}


module.exports = Trashes;