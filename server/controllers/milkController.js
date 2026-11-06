import db from "../config/db.js";

// Auto-create table if not exists, and make sure 'amount' column exists
// const ensureTable = async () => {
//     try {
//         await db.query(`
//             CREATE TABLE IF NOT EXISTS milk_records (
//                 record_id INT AUTO_INCREMENT PRIMARY KEY,
//                 farm_id INT NOT NULL,
//                 record_date DATE NOT NULL,
//                 session VARCHAR(20) NOT NULL DEFAULT 'Morning',
//                 quantity DECIMAL(8,2) NOT NULL,
//                 amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
//                 notes VARCHAR(255) DEFAULT NULL
//             ) ENGINE=InnoDB;
//         `);

        // Safely add 'amount' column if table was created in an earlier step without it
//         try {
//             await db.query(`
//                 ALTER TABLE milk_records ADD COLUMN amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
//             `);
//         } catch {
//             // Column already exists, ignore
//         }
//     } catch (err) {
//         console.error("Auto table creation check:", err.message);
//     }
// };

// 1. Get all milk records for logged-in farm
export const getMilkRecords = async (req, res) => {
    const farmId = req.user?.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned to this user."
        });
    }

    try {
        // await ensureTable();

        const sql = "SELECT * FROM milk_records WHERE farm_id = ? ORDER BY record_date DESC, record_id DESC";
        const [records] = await db.query(sql, [farmId]);

        res.json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error("Get milk records error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch milk records."
        });
    }
};

// 2. Add a new milk record
export const addMilkRecord = async (req, res) => {
    const farmId = req.user?.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned to this user."
        });
    }

    const { record_date, session, quantity, amount, notes } = req.body;

    // Simple validation: date and quantity required
    if (!record_date || quantity === undefined || quantity === "") {
        return res.status(400).json({
            success: false,
            message: "Please provide record date and milk quantity."
        });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a positive number."
        });
    }

    const amt = Number(amount) || 0;

    try {
        // await ensureTable();

        const sql = `
            INSERT INTO milk_records (farm_id, record_date, session, quantity, amount, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            farmId,
            record_date,
            session || "Morning",
            qty,
            amt,
            notes || null
        ]);

        res.status(201).json({
            success: true,
            message: "Milk record added successfully!",
            record_id: result.insertId
        });
    } catch (error) {
        console.error("Add milk record error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to add milk record."
        });
    }
};

// 3. Delete a milk record
export const deleteMilkRecord = async (req, res) => {
    const farmId = req.user?.farm_id;
    const { id } = req.params;

    try {
        await db.query(
            "DELETE FROM milk_records WHERE record_id = ? AND farm_id = ?",
            [id, farmId]
        );

        res.json({
            success: true,
            message: "Milk record deleted successfully."
        });
    } catch (error) {
        console.error("Delete milk record error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete milk record."
        });
    }
};
