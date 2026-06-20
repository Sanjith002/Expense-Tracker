import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type: String,
        enum: ["income","expense"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps:true})

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;