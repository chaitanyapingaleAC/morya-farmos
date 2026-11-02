
import mysql from "mysql2/promise";
import localConfig from "./db.local.js";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: localConfig.password,
    database: "morya_farmos",
    dateStrings: true
});

export default db;
