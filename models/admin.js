import mongoose from "mongoose";

// Defination Schema
const adminSchema=new mongoose.Schema({
    name:{type:String ,required:true ,trim:true},
    email:{type:String ,required:true ,trim:true,match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/},
    password:{type:String ,required:true ,trim:true}
   
})

// Model
const adminModel=mongoose.model("admin",adminSchema)

export default adminModel