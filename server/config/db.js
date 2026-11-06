import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let localPassword = "1234";
try {
    const local = await import("./db.local.js");
    if (local?.default?.password !== undefined) {
        localPassword = local.default.password;
    }
} catch {
    // db.local.js is optional
}

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : localPassword,
    database: process.env.DB_NAME || "morya_farmos",
    port: Number(process.env.DB_PORT) || 3306,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;
