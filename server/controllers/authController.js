
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, farm_name } = req.body ?? {};
    // Validate required fields
    if (typeof farm_name !== "string" || !farm_name.trim() || farm_name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Farm name is required (maximum 100 characters).",
      });
    }
    if (
      typeof full_name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required.",
      });
    }

    const name = full_name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!name || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Full name must contain 1 to 100 characters.",
      });
    }

    if (
      normalizedEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 12 characters and at most 72 UTF-8 bytes.",
      });
    }

    // Check whether the email is already registered
    const [existingUsers] = await db.query(
      "SELECT user_id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the farm and its owner together
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [farmResult] = await connection.query(
        "INSERT INTO farms (farm_name) VALUES (?)",
        [farm_name.trim()]
      );

      const farmId = farmResult.insertId;

      const [result] = await connection.query(
        `INSERT INTO users (full_name, email, password_hash, role, farm_id)
     VALUES (?, ?, ?, 'user', ?)`,
        [name, normalizedEmail, passwordHash, farmId]
      );

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: "Farm account created successfully.",
        user: {
          user_id: result.insertId,
          full_name: name,
          email: normalizedEmail,
          role: "user",
          farm_id: farmId,
        },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }


  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    console.error("Registration failed:", error.code || error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    // Validate login input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.length > 255 || password.length > 1024) {
      return res.status(400).json({
        success: false,
        message: "Invalid login input.",
      });
    }

    // Find the registered user
    const [users] = await db.query(
      `SELECT user_id, full_name, email, password_hash, role, farm_id
           FROM users
            WHERE email = ?
             LIMIT 1`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    // Compare entered password with stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check JWT configuration
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || jwtSecret.length < 32) {
      console.error("JWT_SECRET is missing or too short.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    // Generate a signed token valid for 1 hour
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
      },
      jwtSecret,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        farm_id: user.farm_id,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};
