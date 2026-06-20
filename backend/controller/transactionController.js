import Transaction from "../models/transactionModel.js";

const addTransaction = async (req,res) => {
    try {
        const {description,amount,type} = req.body;
        const userid = req.user._id;
        if(!description || !description.trim()){
            return res.status(400).json({message:"Description is empty"})
        }
        if(typeof amount !== "number"){
            return res.status(400).json({message:"Amount should be in number"})
        }
        const transaction = new Transaction({
            description,
            amount,
            type,
            user:userid
        })
        await transaction.save();
        res.status(201).json({message:"Transation Added"});
    } catch (error) {
        res.status(500).json({message:error.message});   
    }
}

const updateTransaction = async (req,res) => {
    try {
        const {description,amount,type} = req.body;
        const {transactionid} = req.params;
        const userid = req.user._id;
        const transaction = await Transaction.findOne({
            _id: transactionid,
            user: userid
        });
        if(!transaction){
            return res.status(400).json({message:"Transaction not found"})
        };
        if(typeof amount !== "number"){
            return res.status(400).json({message:"Amount should be in number"})
        }
        await Transaction.updateOne({_id:transactionid},{
            description,
            amount,
            type
        });
        res.status(200).json({message:"Transation updated"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const deleteTransaction = async (req,res) => {
    try {
        const {transactionid} = req.params;
        const userid = req.user._id;
        const transaction = await Transaction.findOne({
            _id:transactionid,
            user:userid
        })
        if(!transaction){
            return res.status(400).json({message:"Transaction not found"});
        }
        await Transaction.deleteOne({
            _id:transactionid,
            user:userid
        })
        res.status(200).json({message:"Transaction deleted successfuly!"})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const getTransaction = async (req,res) => {
    try {
        const userid = req.user._id;
        const allTransactions = await Transaction.find({
            user:userid
        })
        if(!allTransactions){
            return res.status(400).json({message:"No transaction added"})
        }
        res.status(200).json({allTransactions});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export {addTransaction,updateTransaction,deleteTransaction,getTransaction}