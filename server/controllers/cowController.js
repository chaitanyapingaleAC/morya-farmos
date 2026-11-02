import db from "../config/db.js";

const addCow = async (req, res) => {

    try {
        const { cow_id, cow_name, date_of_birth, birth_date_is_estimated, breed, description } = req.body;

        if (cow_id.length > 0) {
            const sql = "insert into cows(cow_id, cow_name, date_of_birth,birth_date_is_estimated, breed, description) values (?,?,?,?,?,?)";

            await db.query(sql, [cow_id, cow_name, date_of_birth || null, birth_date_is_estimated ? 1 : 0, breed || null, description || null]);

            res.status(201).send({ messege: "cow registered succesfully..." })
        } else {
            return res.status(400).send({ messege: "Invalid Details of Cows" });
        }


    } catch (error) {

        console.log(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Cow ID already exists" });
        }

        res.status(500).json({message: "Failed to register cow" });


    }

}

const getAllCow = async (req,res)=>{
    try {

        const sql="select * from cows";
        const [result] = await db.query(sql);

        res.status(200).send(result);
        
    } catch (error) {
        console.log(error);

        res.status(500).json({message: "Failed to fetch cows"})
}
}

const getCowById = async (req,res)=>{
  try {
      const { id } = req.params;
      const sql = "select * from cows where cow_id=?";
      const [result] = await db.query(sql, [id]);

       if (result.length === 0) {
            return res.status(404).send({message: "Cow not found" })
            }

      res.send({ messege: result });

  } catch (error) {
     console.log(error);

    res.status(500).json({message: "Failed to fetch cows"})
  }


}





const updateCow = async (req, res) => {
    try {
        const { id } = req.params;

        const {cow_name , date_of_birth , birth_date_is_estimated , breed , description } = req.body;

        if ( typeof cow_name !== "string" ||  cow_name.length > 100) {
            return res.status(400).json({message: "Valid Cow Name is required"});
        }

        const sql = ` UPDATE cows  SET cow_name = ?, date_of_birth = ?, birth_date_is_estimated = ?,  breed = ?,  description = ? WHERE cow_id = ? `;

        const [result] = await db.query(sql, [
            cow_name.trim(),
            date_of_birth || null,
            birth_date_is_estimated ? 1 : 0,
            breed || null,
            description || null,
            id
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


const deleteCow = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = "DELETE FROM cows WHERE cow_id = ?";

        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cow not found"});
        }

        res.status(200).json({ message: "Cow deleted successfully" });

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








export { addCow , getAllCow , getCowById , updateCow , deleteCow};