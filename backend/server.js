import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import express from "express";
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

dotenv.config();

const port = process.env.PORT || 6000;
const app = express();

app.use(cors({
    origin:"https://expense-tracker-9w7.pages.dev"
}));
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/transaction", transactionRoutes)
app.use("/api/dashboard", dashboardRoutes)

connectDB().then(() => {
    app.listen(port, () => {
    console.log(`server running on ${port}`)
})
});

