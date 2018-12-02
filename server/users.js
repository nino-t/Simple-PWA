var db = require("./db.js");
var moment = require("moment");
var _ = require("lodash");

var formatResponseObject = function(user) {
  if (user) {
    user = _.clone(user);
    user.created_at = moment(user.created_at).format("DD/MM/YYYY HH:mm");
  }
  return user;
};

var get = function() {
  var users = db.get("users").value();
  return users.map(formatResponseObject);
};

module.exports = {
  get: get,
  formatResponseObject: formatResponseObject
};
