
import db from "../config/db.js";

// Check that the logged-in farm owner has a valid farm
const getFarmId = (req, res) => {
    const farmId = req.user?.farm_id;

    if (!Number.isSafeInteger(Number(farmId)) ||
        Number(farmId) <= 0 ||
        farmId == null) {
        res.status(403).json({
            message: "No valid farm assigned to this account"
        });
        return null;
    }

    return Number(farmId);
};

// Add cow to logged-in owner's farm
const addCow = async (req, res) => {
    const farmId = getFarmId(req, res);
    if (farmId === null) return;

    try {
        const {
            cow_id,
            cow_name,
            date_of_birth,
            birth_date_is_estimated,
            breed,
            description
        } = req.body;

        if (typeof cow_id !== "string" ||
            cow_id.trim().length === 0 ||
            typeof cow_name !== "string" ||
            cow_name.trim().length === 0 ||
            cow_name.length > 100) {
            return res.status(400).json({
                messege: "Invalid Details of Cows"
            });
        }

        const sql = `
            INSERT INTO cows
            (cow_id, cow_name, date_of_birth,
             birth_date_is_estimated, breed, description, farm_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            cow_id.trim(),
            cow_name.trim(),
            date_of_birth || null,
            birth_date_is_estimated ? 1 : 0,
            breed || null,
            description || null,
            farmId
        ]);

        res.status(201).json({
            messege: "cow registered succesfully..."
        });

    } catch (error) {
        console.log(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Cow ID already exists"
            });
        }

        res.status(500).json({
            message: "Failed to register cow"
        });
    }
};

// Fetch cows belonging only to logged-in farm
const getAllCow = async (req, res) => {
    const farmId = getFarmId(req, res);
    if (farmId === null) return;

    try {
        const sql = "SELECT * FROM cows WHERE farm_id = ?";
        const [result] = await db.query(sql, [farmId]);

        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch cows"
        });
    }
};

// Fetch one cow belonging to logged-in farm
const getCowById = async (req, res) => {
    const farmId = getFarmId(req, res);
    if (farmId === null) return;

    try {
        const { id } = req.params;

        const sql = `
            SELECT * FROM cows
            WHERE cow_id = ? AND farm_id = ?
        `;

        const [result] = await db.query(sql, [id, farmId]);

        if (result.length === 0) {
            return res.status(404).json({
                message: "Cow not found"
            });
        }

        res.send({ messege: result });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch cows"
        });
    }
};

// Update only a cow belonging to logged-in farm
const updateCow = async (req, res) => {
    const farmId = getFarmId(req, res);
    if (farmId === null) return;

    try {
        const { id } = req.params;
        const {
            cow_name,
            date_of_birth,
            birth_date_is_estimated,
            breed,
            description
        } = req.body;

        if (typeof cow_name !== "string" ||
            cow_name.trim().length === 0 ||
            cow_name.length > 100) {
            return res.status(400).json({
                message: "Valid Cow Name is required"
            });
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
            breed || null,
            description || null,
            id,
            farmId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Cow not found"
            });
        }

        res.status(200).json({
            message: "Cow updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update cow"
        });
    }
};

// Delete only a cow belonging to logged-in farm
const deleteCow = async (req, res) => {
    const farmId = getFarmId(req, res);
    if (farmId === null) return;

    try {
        const { id } = req.params;

        const sql = `
            DELETE FROM cows
            WHERE cow_id = ? AND farm_id = ?
        `;

        const [result] = await db.query(sql, [id, farmId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Cow not found"
            });
        }

        res.status(200).json({
            message: "Cow deleted successfully"
        });

    } catch (error) {
        console.log(error);

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                message: "Cannot delete cow with existing breeding records"
            });
        }

        res.status(500).json({
            message: "Failed to delete cow"
        });
    }
};

export {
    addCow,
    getAllCow,
    getCowById,
    updateCow,
    deleteCow
};
