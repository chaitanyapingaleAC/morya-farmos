
const mysql = require("mysql2");
require("dotenv").config();


const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "morya_farmos",

  // Return MySQL DATE values as YYYY-MM-DD strings.
  // This prevents dates from shifting because of timezone conversion.
  dateStrings: true,
});


db.connect((error) => {
  if (error) {
    console.error("MySQL connection failed:", error.message);
    return;
  }

  console.log("MySQL database connected successfully!");
});

module.exports = db;
