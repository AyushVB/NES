import mongoose from "mongoose";

// Defination Schema
const CSuiteSchema=new mongoose.Schema({
    owner_email:{type:String ,required:true ,trim:true,match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/}
})

// Model
const CSuiteModel=mongoose.model("CSuite",CSuiteSchema)

export default CSuiteModel