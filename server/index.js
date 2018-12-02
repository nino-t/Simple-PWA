var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

var users = require('./users.js');
var messages = require('./messages.js');

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/users.json", function(req, res) {
  res.json(users.get());
});

app.get("/messages.json", function(req, res) {
  res.json(messages.get());
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
