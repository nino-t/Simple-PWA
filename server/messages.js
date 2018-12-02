var db = require("./db.js");
var moment = require("moment");
var _ = require("lodash");

var formatResponseObject = function(message) {
  if (message) {
    message = _.clone(message);
    message.created_at = moment(message.created_at).format("DD/MM/YYYY HH:mm");
  }
  return message;
};

var get = function() {
  var messages = db.get("messages").value();
  return messages.map(formatResponseObject);
};

module.exports = {
  get: get,
  formatResponseObject: formatResponseObject
};
