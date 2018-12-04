var db = require("./db.js");
var moment = require("moment");
var _ = require("lodash");
var uid = require("uid");

var formatResponseObject = function(message) {
  if (message) {
    message = _.clone(message);
    message.created_at = moment(message.created_at).format("DD/MM/YYYY HH:mm");
  }
  return message;
};

var get = function() {
  var messages = db.get("messages").value();
  return {
    status: 200,
    data: messages.map(formatResponseObject)
  };
};

var store = function(payload) {
  var message = {
    "id":           uid(),
    "user_id":      1,
    "replay_id":    0,
    "message":      _.get(payload, 'message', ''),
    "status":       'Readed',
    "created_at":   moment().format('YYYY-MM-DD HH:mm:ss')
  };

  db.get("messages")
    .push(message)
    .value();

  return {
    status: 200,
    data: formatResponseObject(message)
  };
};


module.exports = {
  get: get,
  store: store,
  formatResponseObject: formatResponseObject
};
