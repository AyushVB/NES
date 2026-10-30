import adminModel from "../models/admin.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import transporter from "../config/emailConfig.js"
import dotenv from 'dotenv'

dotenv.config()

// name,email,password

class adminController{
    static adminRegistration=async (req,res)=>{
        const {name,email,password}=req.body
        const admin=await adminModel.findOne({email:email})
        if(admin){
            res.send({"status":"failed","message":"Email already exists"})
        }
        else if(!(name && email && password )){
            res.send({"status":"failed","message":"All fields are required"})
        }
        else{
            try {
                const salt=await bcrypt.genSalt(12)
                const hashPassword=await bcrypt.hash(password,salt)

                const newAdmin=new adminModel({
                    name:name,
                    email:email,
                    password:hashPassword
                })
                await newAdmin.save() 

                // JWT create
                const saved_admin=await adminModel.findOne({email:email})
                const token=jwt.sign({adminID:saved_admin._id,type:"admin"},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                res.status(201).send({"status":"Success","message":"registeration sucessfully....","token":token})      
            } catch (error) {
                res.send({"status":"failed","message":"Unable to register...."})    
            }
        }            
    } 
    static adminLogin=async (req,res)=>{
        const{email,password}=req.body
        const admin=await adminModel.findOne({email:email})
        if(!admin){
            res.status(400).send({"status":"failed","message":"You are not register admin.."})
        }
        else if(!(email && password)){
            res.send({"status":"failed","message":"All fields are required"})   
        }
        else{
            try {
                const ismatch=await bcrypt.compare(password,admin.password)
                if(!ismatch){ 
                    res.status(400).send({"status":"failed","message":"Email or Password is invalid"})       
                }
                else{
                    // JWT create
                    const token=jwt.sign({adminID:admin._id,type:"admin"},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                    res.send({"status":"success","message":"login successfully...","token":token})     
                }
            }      
            catch (error) {
                console.log(error)
                res.status(400).send({"status":"failed","message":"Unable to login..."})
            }  
        }
    }    
    static changeAdminPassword= async (req,res)=>{
        const {password} =req.body
        if(!password ){
            res.send({"status":"failed","message":"Password field is required"})  
        }
        else{
            try {
                const salt=await bcrypt.genSalt(12)
                const hashPassword=await bcrypt.hash(password,salt)
                await adminModel.findByIdAndUpdate(req.admin._id,{$set:{password:hashPassword}})
                res.send({"status":"success","message":"password change successfully..."})

            } catch (error) {
                console.log(error)
                res.status(400).send({"status":"failed","message":"Unable to change admin password..."})    
            }       
        }   
    }
    static loggedAdmin=async (req,res)=>{
        res.send({"admin":req.admin})
    }
    static sendAdminPasswordResetEmail=async (req,res)=>{
        const{email}=req.body
        const admin=await adminModel.findOne({email:email})
        if(!email){
            res.send({"status":"failed","message":"email field is required..."})
        }
        else if(!admin){
            res.send({"status":"failed","message":"email doesnt exists"})        
        }
        else{
            const secret=admin._id+process.env.JWT_SECRET_KEY
            const token=jwt.sign({adminID:admin._id},secret,{expiresIn:'15m'})
            const link=`http://localhost:3000/api/admin/reset/${admin._id}/${token}`
           
            // sent email 
            const info=transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:admin.email,
                subject:"API-Password Reset Link",
                html:`<a href=${link}>click here</a>to reset your password`
            })
            res.send({"status":"success","message":"password reset email is sent....please check email.. ","info":info})
        }
    } 
    static adminPasswordReset=async (req,res)=>{
        try {
            const{password}=req.body
            const{id,token}=req.params
            const admin=await adminModel.findById(id)
            const secret=admin._id+process.env.JWT_SECRET_KEY
            jwt.verify(token,secret)
            if(!password ){
                res.send({"status":"failed","message":"Password field is required"})
            }
            else{
                const salt=await bcrypt.genSalt(12)
                const hashPassword=await bcrypt.hash(password,salt)
                await adminModel.findByIdAndUpdate(admin._id,{$set:{password:hashPassword}})
                res.send({"status":"success","message":"password reset successfully..."})
            }
        } catch (error) {
            res.send({"status":"failed","message":"Invalid token or id"}) 
        }
    }
}

export default adminController;