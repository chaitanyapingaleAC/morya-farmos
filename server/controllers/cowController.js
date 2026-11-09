import db from "../config/db.js";

// Helper function to extract farm_id from logged-in user token
const getFarmId = (req, res) => {
  const farmId = req.user?.farm_id;
  if (!farmId) {
    res.status(403).json({ message: "No farm assigned to this account" });
    return null;
  }
  return Number(farmId);
};

// 1. Add a new cow
export const addCow = async (req, res) => {
  const farmId = getFarmId(req, res);
  if (farmId === null) return;

  try {
    const { cow_id, cow_name, date_of_birth, birth_date_is_estimated, breed, description } = req.body;

    if (!cow_id || !cow_name) {
      return res.status(400).json({ message: "Cow Tag/ID and Name are required" });
    }

    const sql = `
      INSERT INTO cows (cow_id, cow_name, date_of_birth, birth_date_is_estimated, breed, description, farm_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      cow_id.trim(),
      cow_name.trim(),
      date_of_birth || null,
      birth_date_is_estimated ? 1 : 0,
      breed?.trim() || null,
      description?.trim() || null,
      farmId
    ]);

    res.status(201).json({ message: "Cow registered successfully" });
  } catch (error) {
    console.error("Error adding cow:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Cow ID already exists" });
    }
    res.status(500).json({ message: "Failed to register cow" });
  }
};

// 2. Get all cows for the logged-in farm
export const getAllCow = async (req, res) => {
  const farmId = getFarmId(req, res);
  if (farmId === null) return;

  try {
    const sql = "SELECT * FROM cows WHERE farm_id = ? ORDER BY cow_name ASC";
    const [cows] = await db.query(sql, [farmId]);
    res.status(200).json(cows);
  } catch (error) {
    console.error("Error fetching cows:", error);
    res.status(500).json({ message: "Failed to fetch cows" });
  }
};

// 3. Get a single cow by ID
export const getCowById = async (req, res) => {
  const farmId = getFarmId(req, res);
  if (farmId === null) return;

  try {
    const { id } = req.params;
    const sql = "SELECT * FROM cows WHERE cow_id = ? AND farm_id = ?";
    const [rows] = await db.query(sql, [id, farmId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cow not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching cow:", error);
    res.status(500).json({ message: "Failed to fetch cow" });
  }
};

// 4. Update cow details
export const updateCow = async (req, res) => {
  const farmId = getFarmId(req, res);
  if (farmId === null) return;

  try {
    const { id } = req.params;
    const { cow_name, date_of_birth, birth_date_is_estimated, breed, description } = req.body;

    if (!cow_name) {
      return res.status(400).json({ message: "Cow Name is required" });
    }

    const sql = `
      UPDATE cows
      SET cow_name = ?,
          date_of_birth = ?,
          birth_date_is_estimated = ?,
          breed = ?,
          description = ?
      WHERE cow_id = ? AND farm_id = ?
    `;

    const [result] = await db.query(sql, [
      cow_name.trim(),
      date_of_birth || null,
      birth_date_is_estimated ? 1 : 0,
      breed?.trim() || null,
      description?.trim() || null,
      id,
      farmId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cow not found" });
    }

    res.status(200).json({ message: "Cow updated successfully" });
  } catch (error) {
    console.error("Error updating cow:", error);
    res.status(500).json({ message: "Failed to update cow" });
  }
};

// 5. Delete a cow
export const deleteCow = async (req, res) => {
  const farmId = getFarmId(req, res);
  if (farmId === null) return;

  try {
    const { id } = req.params;
    const sql = "DELETE FROM cows WHERE cow_id = ? AND farm_id = ?";
    const [result] = await db.query(sql, [id, farmId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cow not found" });
    }

    res.status(200).json({ message: "Cow deleted successfully" });
  } catch (error) {
    console.error("Error deleting cow:", error);
    res.status(500).json({ message: "Failed to delete cow" });
  }
};
