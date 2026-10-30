import userModel from "../models/users.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import transporter from "../config/emailConfig.js"
import dotenv from 'dotenv'

dotenv.config()

// firstName middleName lastName email password phone_1 phone_2 collegeName city photo paid CSuite foundersFusion regDate

class userController{
    static userRegistration=async (req,res)=>{
        try {
            const {firstName,middleName,lastName,email,password,phone_1,phone_2,collegeName, city,photo,paid}=req.body
            const user=await userModel.findOne({email:email})
            if(user){
                res.send({"status":"failed","message":"Email already exists"})
            }
            else if((!Number.isInteger(paid))|| !(paid==0 || paid==1)){
                res.send({"status":"failed","message":"paid need to be 0 or 1 "})
            }
            else if(!(firstName && middleName && lastName && email && password && phone_1 && collegeName && city && photo )){
                res.send({"status":"failed","message":"All fields are required except phone_2"})
            }
            else{
                const salt=await bcrypt.genSalt(12)
                const hashPassword=await bcrypt.hash(password,salt)

                const newUser=new userModel({
                    firstName:firstName,
                    middleName:middleName,
                    lastName:lastName,
                    email:email,
                    password:hashPassword,
                    phone_1:phone_1,
                    phone_2:phone_2,
                    collegeName:collegeName, 
                    city:city,
                    photo:photo,
                    paid:paid,
                    CSuite:false, 
                    foundersFusion:false
                })
                await newUser.save() 

                // JWT create
                const saved_user=await userModel.findOne({email:email})
                const token=jwt.sign({userID:saved_user._id,type:"user"},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
                res.status(201).send({"status":"Success","message":"registeration sucessfully....","token":token})      
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to register...."})    
        }            
    } 
    static userLogin=async (req,res)=>{
        try {
            const{email,password}=req.body
            const user=await userModel.findOne({email:email})
            if(!user){
                res.status(400).send({"status":"failed","message":"You are not register user.."})
            }
            else if(!(email && password)){
                res.send({"status":"failed","message":"All fields are required"})   
            }
            else{
                const ismatch=await bcrypt.compare(password,user.password)
                if(!ismatch){ 
                    res.status(400).send({"status":"failed","message":"Email or Password is invalid"})       
                }
                else{
                    // JWT create
                    const token=jwt.sign({userID:user._id,type:"user"},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
                    res.send({"status":"success","message":"login successfully...","token":token})     
                }
            }         
        }
        catch (error) {
            console.log(error)
            res.status(400).send({"status":"failed","message":"Unable to login..."})
        }
    }    
    static updateUser= async (req,res)=>{
        try {
            let {firstName,middleName,lastName,password,phone_1,phone_2,collegeName, city,photo} =req.body
    
            if(!(typeof(firstName)=="undefined" || firstName )){
                return res.send({"status":"failed","message":"firstName field not to be null ...."})      
            }
            if(!(typeof(middleName)=="undefined" || middleName )){
                return res.send({"status":"failed","message":"middleName field not to be null ...."})      
            }
            if(!(typeof(lastName)=="undefined" || lastName )){
                return res.send({"status":"failed","message":"lastName field not to be null ...."})      
            }
            if(!(typeof(password)=="undefined" || password )){
                return res.send({"status":"failed","message":"password field not to be null ...."})      
            }
            if(!(typeof(phone_1)=="undefined" || phone_1 )){
                return res.send({"status":"failed","message":"phone_1 field not to be null ...."})      
            }
            if(!(typeof(collegeName)=="undefined" || collegeName )){
                return res.send({"status":"failed","message":"collegeName field not to be null ...."})      
            }
            if(!(typeof(city)=="undefined" || city )){
                return res.send({"status":"failed","message":"city field not to be null ...."})      
            }
            if(!(typeof(photo)=="undefined" || photo )){
                return res.send({"status":"failed","message":"photo field not to be null ...."})      
            }
 
            if(password){
                const salt=await bcrypt.genSalt(10)
                password=await bcrypt.hash(password,salt)
            }

            await userModel.findByIdAndUpdate(req.user._id,{$set:{
                firstName:firstName,
                middleName:middleName,
                lastName:lastName,
                password:password,
                phone_1:phone_1,
                phone_2:phone_2,
                collegeName:collegeName, 
                city:city,
                photo:photo
            }})
            res.send({"status":"success","message":"user updated successfully..."})
        } catch (error) {
            console.log(error)
            res.status(400).send({"status":"failed","message":"Unable to update user..."})    
        }       
    }
    static loggedUser=async (req,res)=>{
        try {
            res.send({"user":req.user})        
        } catch (error) {
            console.log(error)
            res.status(400).send({"status":"failed","message":"Unable to get logged user data..."})        
        }
        
    }
    static sendUserPasswordResetEmail=async (req,res)=>{
        try {
            const{email}=req.body
            const user=await userModel.findOne({email:email})
            if(!email){
                res.send({"status":"failed","message":"email field is required..."})
            }
            else if(!user){
                res.send({"status":"failed","message":"email doesnt exists"})        
            }
            else{
                const secret=user._id+process.env.JWT_SECRET_KEY
                const token=jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
                const link=`http://localhost:3000/api/user/reset/${user._id}/${token}`
            
                // sent email 
                const info=transporter.sendMail({
                    from:process.env.EMAIL_FROM,
                    to:user.email,
                    subject:"API-Password Reset Link",
                    html:`<a href=${link}>click here</a>to reset your password`
                })
                res.send({"status":"success","message":"password reset email is sent....please check email.. ","info":info})
            }        
        } catch (error) {
            console.log(error)
            res.status(400).send({"status":"failed","message":"Unable to update user..."})        
        }    
    } 
    static userPasswordReset=async (req,res)=>{
        try {
            const{password}=req.body
            const{id,token}=req.params
            const user=await userModel.findById(id)
            const secret=user._id+process.env.JWT_SECRET_KEY
            jwt.verify(token,secret)
            if(!password ){
                res.send({"status":"failed","message":"Password field is required"})
            }
            else{
                const salt=await bcrypt.genSalt(10)
                const hashPassword=await bcrypt.hash(password,salt)
                await userModel.findByIdAndUpdate(user._id,{$set:{password:hashPassword}})
                res.send({"status":"success","message":"password reset successfully..."})
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Invalid token or id"}) 
        }
    }
    static deleteUser=async (req,res)=>{ 
        try {
            const id=req.query.id
            const user=await userModel.findById(id)
            if(!user){
                res.send({"status":"failed","message":"User id is incorrect...."})
            }
            else{
                await userModel.findByIdAndDelete(id)
                res.send({"status":"success","message":"Delete user successfully..."})
            } 
        }catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to delete user...."})
        }       
    }
    static getAllUser=async (req,res)=>{
        try {
            const users=await userModel.find()
            res.send({"status":"success","users":users})
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Failed to get all users ...."})
        }
    }
}

export default userController;