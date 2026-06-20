import express from "express";
import {signUpController,loginController,logoutController,getCurrentUser} from "../controller/authController.js"
import protectRoutes from "../middleware/protectRoutes.js";

const router = express.Router()

router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/getme", protectRoutes, getCurrentUser);
router.get("/verify",protectRoutes,(req, res) => {
    res.status(200).json({
        message: "Token is valid",
        user: req.user
    });
})

export default router;