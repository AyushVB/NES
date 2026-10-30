import foundersFusionModel from '../models/foundersFusion.js'
import userModel from "../models/users.js"
//person_id  startupIdea startupDescription 

class foundersFusionController{
    static createFoundersFusion=async (req,res)=>{
        var { startupIdea ,startupDescription}=req.body
        const user=await userModel.findById(req.user._id)
        const count =await foundersFusionModel.countDocuments({})
        if(count>=5){
            res.send({"status":"failed","message":"Registration full ...."}) 
        }
        else if(!user){
            res.send({"status":"failed","message":"user is not registered user...."})
        }
        else if(user.foundersFusion){
            res.send({"status":"failed","message":"user is already register to foundersFusion...."})
        }
        else if(!user.paid){
            res.send({"status":"failed","message":"user is not paid thier entry fee...."})
        }
        else if(!( startupIdea &&startupDescription)){
            res.send({"status":"failed","message":"All fields are required ...."})      
        }
        else{
            try {
                const newFoundersFusion=new foundersFusionModel({
                    owner_email:user.email,
                    startupIdea:startupIdea,
                    startupDescription:startupDescription
                })
                await newFoundersFusion.save()
                await userModel.findByIdAndUpdate(user._id,{$set:{foundersFusion:true}})
                res.send({"status":"Success","message":"User added in FoundersFusion compition sucessfully..."})      
            } catch (error) {
                res.send({"status":"failed","message":"Unable to add user in foundersFusion compition...."})   
            }       
        } 
    }
    static updateFoundersFusion=async (req,res)=>{
        var {id,startupIdea ,startupDescription}=req.body
        try {
            const foundersFusion=await foundersFusionModel.findById(id)
            if(!foundersFusion){
                return res.send({"status":"failed","message":"Given ID is incorrect ...."})
            }
            if(!(typeof(startupIdea)=="undefined" || startupIdea )){
                return res.send({"status":"failed","message":"startupIdea field not to be null ...."})      
            }
            if(!(typeof(startupDescription)=="undefined" || startupDescription )){
                return res.send({"status":"failed","message":"startupDescription field not to be null ...."})      
            } 
            await foundersFusionModel.findByIdAndUpdate(id,{$set:{
                startupIdea:startupIdea,
                startupDescription:startupDescription
            }})
            res.send({"status":"Success","message":"admin updated FoundersFusion compition sucessfully ..."})      
        } catch (error) {
            res.send({"status":"failed","message":"Unable to update foundersFusion...."})   
        } 
    }
    static deleteFoundersFusion=async (req,res)=>{
        const id=req.query.id
        try {
            const foundersFusion=await foundersFusionModel.findById(id)
            if(!foundersFusion){
                res.send({"status":"failed","message":"FoundersFusion compition id is incorrect...."})
            }
            else{
                await foundersFusionModel.findByIdAndDelete(id)
                await userModel.findOneAndUpdate({email:foundersFusion.owner_email},{foundersFusion:false} )
                res.send({"status":"success","message":"delete foundersFusion successfully..."})
            } 
        }    
        catch (error) {
                res.send({"status":"failed","message":"Unable to delete foundersFusion...."})
        }
           
    }
    static getAllFoundersFusion=async (req,res)=>{
        try {
            const foundersFusions=await foundersFusionModel.find()
            res.send({"status":"success","foundersFusions":foundersFusions})
        } catch (error) {
            res.send({"status":"failed","message":"Failed to get all foundersFusions ...."})
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
            const foundersFusions=await foundersFusionModel.find(filters) 
            res.send({"status":"success","foundersFusions":foundersFusions})       
        } catch (error) {
            res.send({"status":"failed","message":"Failed to filter foundersFusions ...."})
        }   
    }
    static loggedFoundersFusion=async (req,res)=>{
        try {
            const foundersFusion=await foundersFusionModel.find({owner_email:req.user.email})
            res.send({"status":"success","foundersFusion":foundersFusion})
        } catch (error) {
            res.send({"status":"failed","message":"Failed to get user foundersFusion ...."})
        }
    }
    static updateFoundersFusionByUser=async (req,res)=>{
        var {id,startupIdea ,startupDescription}=req.body
        try {
            const foundersFusion=await foundersFusionModel.findById(id)
            if(!foundersFusion){
                return res.send({"status":"failed","message":"Given ID is incorrect ...."})
            }
            if(foundersFusion.owner_email !==req.user.email){
                return res.send({"status":"failed","message":"Given ECC ID is not belong to these user ...."})
            }
            if(!(typeof(startupIdea)=="undefined" || startupIdea )){
                return res.send({"status":"failed","message":"startupIdea field not to be null ...."})      
            }
            if(!(typeof(startupDescription)=="undefined" || startupDescription )){
                return res.send({"status":"failed","message":"startupDescription field not to be null ...."})      
            }
        
            await foundersFusionModel.findByIdAndUpdate(id,{$set:{
                startupIdea:startupIdea,
                startupDescription:startupDescription
            }})
            res.send({"status":"Success","message":"admin updated FoundersFusion compition sucessfully ..."})      
        } catch (error) {
            res.send({"status":"failed","message":"Unable to update foundersFusion...."})   
        } 
    }  
}

// export
export default foundersFusionController;