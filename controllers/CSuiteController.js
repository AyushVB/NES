import CSuiteModel from '../models/CSuite.js'
import userModel from "../models/users.js"
//person_id  startupIdea startupDescription 

class CSuiteController{
    static createCSuite=async (req,res)=>{
        const user=await userModel.findById(req.user._id)
        const count =await CSuiteModel.countDocuments({})
        if(count>=5){
            res.send({"status":"failed","message":"Registration full ...."}) 
        }
        else if(!user){
            res.send({"status":"failed","message":"user is not registered user...."})
        }
        else if(user.CSuite){
            res.send({"status":"failed","message":"user is already register to CSuite...."})
        }
        else if(!user.paid){
            res.send({"status":"failed","message":"user is not paid thier entry fee...."})
        }
        else{
            try {
                const newCSuite=new CSuiteModel({
                    owner_email:user.email
                })
                await newCSuite.save()
                await userModel.findByIdAndUpdate(user._id,{$set:{CSuite:true}})
                res.send({"status":"Success","message":"User added in CSuite compition sucessfully..."})      
            } catch (error) {
                console.log(error)
                res.send({"status":"failed","message":"Unable to add user in CSuite compition...."})   
            }       
        } 
    }
    static deleteCSuite=async (req,res)=>{
        const id=req.query.id
        try {
            const CSuite=await CSuiteModel.findById(id)
            if(!CSuite){
                res.send({"status":"failed","message":"CSuite compition id is incorrect...."})
            }
            else{
                await CSuiteModel.findByIdAndDelete(id)
                await userModel.findOneAndUpdate({email:CSuite.owner_email},{CSuite:false} )
                res.send({"status":"success","message":"delete CSuite successfully..."})
            } 
        }    
        catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to delete CSuite...."})
        }
           
    }
    static getAllCSuite=async (req,res)=>{
        try {
            const CSuites=await CSuiteModel.find()
            res.send({"status":"success","CSuites":CSuites})
        } catch (error) {
            res.send({"status":"failed","message":"Failed to get all CSuites ...."})
        }
    }
    static dynamicFilters=async (req,res)=>{
        try {
            const filters = {};
            for (const key in req.query) {
                if (req.query[key].includes(',')) {
                    const values = req.query[key].split(','); 
                    filters[key] = { $gte: values[0], $lte: values[1] };
                } else if (req.query[key]) {    
                    filters[key] = req.query[key];
                }
            }
            const CSuites=await CSuiteModel.find(filters) 
            res.send({"status":"success","CSuites":CSuites})       
        } catch (error) {
            res.send({"status":"failed","message":"Failed to filter CSuites ...."})
        }   
    }
    static loggedCSuite=async (req,res)=>{
        try {
            const CSuite=await CSuiteModel.find({owner_email:req.user.email})
            res.send({"status":"success","CSuite":CSuite})
        } catch (error) {
            res.send({"status":"failed","message":"Failed to get user CSuite ...."})
        }
    } 
}

// export
export default CSuiteController;