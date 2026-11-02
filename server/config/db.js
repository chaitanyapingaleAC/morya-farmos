
// const mysql = require("mysql2/promise");
// const localConfig = require("./db.local");

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",                                   this is comman js
//   password: localConfig.password,
//   database: "morya_farmos"
// });

// module.exports = db;


import mysql from "mysql2/promise";
import localConfig from "./db.local.js";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: localConfig.password,
    database: "morya_farmos"
});

export default db;

