import express from "express";
import { dashboardController,historyController,incomeController,expenseController } from "../controller/dashboardController.js";
import protectRoutes from "../middleware/protectRoutes.js";

const router = express.Router();

router.get("/",protectRoutes,dashboardController)
router.get("/history",protectRoutes,historyController)
router.get("/income",protectRoutes,incomeController)
router.get("/expense",protectRoutes,expenseController)

export default router;