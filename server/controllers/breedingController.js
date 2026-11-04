
import db from "../config/db.js";

// Add breeding record
export const addBreeding = async (req, res) => {
    const farmId = req.user.farm_id;

    const {
        cow_id,
        insemination_date,
        pregnancy_status,
        confirmation_date,
        expected_delivery_date,
        actual_delivery_date,
        description
    } = req.body;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned."
        });
    }

    if (!cow_id || !insemination_date) {
        return res.status(400).json({
            success: false,
            message: "Cow and insemination date are required."
        });
    }

    try {
        // Ensure the cow belongs to this farm
        const [cows] = await db.query(
            "SELECT cow_id FROM cows WHERE cow_id = ? AND farm_id = ?",
            [cow_id, farmId]
        );

        if (cows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cow not found in your farm."
            });
        }

        const [result] = await db.query(
            `INSERT INTO breeding_records
            (cow_id, insemination_date, pregnancy_status,
             confirmation_date, expected_delivery_date,
             actual_delivery_date, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                cow_id,
                insemination_date,
                pregnancy_status || "Pending",
                confirmation_date || null,
                expected_delivery_date || null,
                actual_delivery_date || null,
                description || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Breeding record added successfully!",
            record_id: result.insertId
        });
    } catch (error) {
        console.error("Add breeding error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add breeding record."
        });
    }
};

// Get all breeding records for the logged-in farm
export const getBreedingRecords = async (req, res) => {
    const farmId = req.user.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned."
        });
    }

    try {
        const [records] = await db.query(
            `SELECT br.*, c.cow_name
             FROM breeding_records br
             JOIN cows c ON br.cow_id = c.cow_id
             WHERE c.farm_id = ?
             ORDER BY br.insemination_date DESC, br.record_id DESC`,
            [farmId]
        );

        res.json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error("Get breeding error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch breeding records."
        });
    }
};

// Get one breeding record
export const getBreedingById = async (req, res) => {
    const farmId = req.user.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned."
        });
    }

    try {
        const [records] = await db.query(
            `SELECT br.*, c.cow_name
             FROM breeding_records br
             JOIN cows c ON br.cow_id = c.cow_id
             WHERE br.record_id = ? AND c.farm_id = ?`,
            [req.params.id, farmId]
        );

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Breeding record not found."
            });
        }

        res.json({
            success: true,
            data: records[0]
        });
    } catch (error) {
        console.error("Get breeding record error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch breeding record."
        });
    }
};

// Update breeding record
export const updateBreeding = async (req, res) => {
    const farmId = req.user.farm_id;

    const {
        cow_id,
        insemination_date,
        pregnancy_status,
        confirmation_date,
        expected_delivery_date,
        actual_delivery_date,
        description
    } = req.body;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned."
        });
    }

    if (!cow_id || !insemination_date) {
        return res.status(400).json({
            success: false,
            message: "Cow and insemination date are required."
        });
    }

    try {
        // Verify selected cow belongs to this farm
        const [cows] = await db.query(
            "SELECT cow_id FROM cows WHERE cow_id = ? AND farm_id = ?",
            [cow_id, farmId]
        );

        if (cows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cow not found in your farm."
            });
        }

        const [result] = await db.query(
            `UPDATE breeding_records br
             JOIN cows c ON br.cow_id = c.cow_id
             SET br.cow_id = ?,
                 br.insemination_date = ?,
                 br.pregnancy_status = ?,
                 br.confirmation_date = ?,
                 br.expected_delivery_date = ?,
                 br.actual_delivery_date = ?,
                 br.description = ?
             WHERE br.record_id = ? AND c.farm_id = ?`,
            [
                cow_id,
                insemination_date,
                pregnancy_status || "Pending",
                confirmation_date || null,
                expected_delivery_date || null,
                actual_delivery_date || null,
                description || null,
                req.params.id,
                farmId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Breeding record not found."
            });
        }

        res.json({
            success: true,
            message: "Breeding record updated successfully!"
        });
    } catch (error) {
        console.error("Update breeding error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update breeding record."
        });
    }
};

// Delete breeding record
export const deleteBreeding = async (req, res) => {
    const farmId = req.user.farm_id;

    if (!farmId) {
        return res.status(403).json({
            success: false,
            message: "No farm assigned."
        });
    }

    try {
        const [result] = await db.query(
            `DELETE br FROM breeding_records br
             JOIN cows c ON br.cow_id = c.cow_id
             WHERE br.record_id = ? AND c.farm_id = ?`,
            [req.params.id, farmId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Breeding record not found."
            });
        }

        res.json({
            success: true,
            message: "Breeding record deleted successfully!"
        });
    } catch (error) {
        console.error("Delete breeding error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete breeding record."
        });
    }
};
