import mongoose from "mongoose";

// Defination Schema
const foundersFusionSchema=new mongoose.Schema({
    owner_email:{type:String ,required:true ,trim:true,match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/},
    startupIdea:{type:String ,required:true ,trim:true},
    startupDescription:{type:String ,required:true ,trim:true},
})

// Model
const foundersFusionModel=mongoose.model("foundersFusion",foundersFusionSchema)

export default foundersFusionModel