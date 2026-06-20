import express from "express";
import protectRoutes from "../middleware/protectRoutes.js";
import { addTransaction,updateTransaction,deleteTransaction,getTransaction } from "../controller/transactionController.js";

const router = express.Router();

router.get("/get",protectRoutes,getTransaction)
router.post("/add",protectRoutes,addTransaction)
router.put("/update/:transactionid",protectRoutes,updateTransaction)
router.delete("/delete/:transactionid",protectRoutes,deleteTransaction)

export default router;