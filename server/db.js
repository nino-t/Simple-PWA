const low = require("lowdb");
const db = low("server/db.json");
module.exports = db;
