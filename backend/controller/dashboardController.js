import Transaction from "../models/transactionModel.js";

const dashboardController = async (req,res) => {
    try {
        const userid = req.user._id;
        const allTransaction = await Transaction.find({
            user:userid,
        })
        if(allTransaction.length === 0){
            return res.status(200).json({
                income:0,
                expense:0,
                balance:0
            })
        }
        let income = 0
        let expense = 0
        for(let i=0; i<allTransaction.length; i++){
            if(allTransaction[i].type == "income"){
                income += allTransaction[i].amount;
            }else if(allTransaction[i].type == "expense"){
                expense += allTransaction[i].amount;
            }
        }
        let balance = income - expense;
        res.status(200).json({
            income,
            expense,
            balance
        })
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const historyController = async (req,res) => {
    try {
        const userid = req.user._id;
        const lastFiveTransaction = await Transaction.find({
            user:userid
        }).sort({ updatedAt: -1 }).limit(5);
        res.status(200).json({lastFiveTransaction});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const incomeController = async (req,res) => {
    try {
        const userid = req.user._id;
        const incomeTransactions = await Transaction.find({
            type:"income",
            user:userid
        }).sort({updatedAt:-1});
        res.status(200).json({incomeTransactions});   
    } catch (error) {
        res.status(500).json({message:error.message});   
    }
}

const expenseController = async (req,res) => {
    try {
        const userid = req.user._id;
        const expenseTransactions = await Transaction.find({
            type:"expense",
            user:userid
        }).sort({updatedAt:-1});
        res.status(200).json({expenseTransactions});   
    } catch (error) {
        res.status(500).json({message:error.message});   
    }
}

export {dashboardController,historyController,incomeController,expenseController}