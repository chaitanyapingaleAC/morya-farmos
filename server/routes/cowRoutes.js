import express from"express";
import { Router } from "express";
import { addCow , getAllCow , getCowById , updateCow , deleteCow} from "../controllers/cowController.js";

const router = Router();

router.post("/",addCow);
router.get("/",getAllCow);
router.get("/:id",getCowById);
router.put("/:id",updateCow);
router.delete("/:id",deleteCow);

export default router;


