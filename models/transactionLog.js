import mongoose from "mongoose";

// Defination Schema
const transactionLogSchema=new mongoose.Schema({
    person_email:{type:String ,required:true ,trim:true,match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/},
    transaction_id:{type:String ,required:true ,trim:true},
    amount:{type:Number ,required:true },
    purpose:{type:String ,required:true ,trim:true},
})

// Model
const transactionLogModel=mongoose.model("transactionLog",transactionLogSchema)

export default transactionLogModel