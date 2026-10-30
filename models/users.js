import mongoose from "mongoose";

// Defination Schema
const userSchema=new mongoose.Schema({
    firstName:{type:String ,required:true ,trim:true},
    middleName:{type:String ,required:true ,trim:true},
    lastName:{type:String ,required:true ,trim:true},
    email:{type:String ,required:true ,trim:true,match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/},
    password:{type:String ,required:true ,trim:true},
    phone_1:{type:String ,required:true ,trim:true},
    phone_2:{type:String  ,trim:true},
    collegeName:{type:String ,required:true ,trim:true},
    city:{type:String ,required:true ,trim:true},
    photo:{type:String ,required:true ,trim:true},
    paid:{type:Boolean ,required:true },
    CSuite:{type:Boolean ,required:true },
    foundersFusion:{type:Boolean ,required:true },
    regDate:{type:Date ,default: Date.now }
    
})

// Model
const userModel=mongoose.model("user",userSchema)

export default userModel