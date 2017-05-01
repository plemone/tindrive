/*
	Author: Md. Tanvir Islam
*/

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const ROOT = "./static";


// binding middlewares

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(ROOT));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(function(req, res, next) {
	console.log(req.method + " request for: " + req.url);
	next();
});


app.get("/", function(req, res) {
	res.status(200).render("index");
});


app.listen(3000, function() {
	console.log("Server is listening on port 3000...");
})