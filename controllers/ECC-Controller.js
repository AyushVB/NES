import ECCModel from '../models/ECC.js'
import userModel from "../models/users.js"


class ECCController{
    static createECC=async (req,res)=>{
        try {
            var { teamName , person_1_email, person_2_email, person_3_email,mentorName,pptLink,paidECC }=req.body
            const user=await userModel.findById(req.user._id)
            const user1=await userModel.findOne({email:person_1_email})
            const user2=await userModel.findOne({email:person_2_email})
            const user3=await userModel.findOne({email:person_3_email})
            const count =await ECCModel.countDocuments({})
            if(!user){
                res.send({"status":"failed","message":"user is not registered user...."})
            }
            else if(!user.paid){
                res.send({"status":"failed","message":"user is not paid thier entry fee...."})
            }
            else if(!paidECC){
                res.send({"status":"failed","message":"user is not paid ECC event FEE...."})
            }
            else if(count>=5){
                res.send({"status":"failed","message":"Registration full ...."}) 
            } 
            else if(!(teamName  && pptLink)){
                res.send({"status":"failed","message":"All fields are required ...."})      
            }
            else if(person_1_email && !user1){
                res.send({"status":"failed","message":"person_1 is not registered user...."})
            }
            else if(person_2_email && !user2){
                res.send({"status":"failed","message":"person_2 is not registered user...."})
            }
            else if(person_3_email && !user3){
                res.send({"status":"failed","message":"person_3 is not registered user...."})
            }
            else if((person_1_email &&((person_1_email===user.email)||(person_1_email===person_2_email) || (person_1_email===person_3_email)))||(person_2_email &&((person_2_email===user.email) || (person_2_email === person_3_email) )) ||(person_3_email &&(person_3_email === user.email ))){
                res.send({"status":"failed","message":"same email id is used OR register person email id used ...."})
            }   
            else{
                const newECC=new ECCModel({
                    teamName:teamName,
                    owner_email:user.email,
                    other_person_1_email:person_1_email,
                    other_person_2_email:person_2_email,
                    other_person_3_email:person_3_email,
                    mentorName:mentorName,
                    pptLink:pptLink
                })
                await newECC.save()
                res.send({"status":"Success","message":"User added in ECC compition sucessfully..."})      
            }          
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to add user in ECC compition...."})   
        } 
    }
    static updateECC=async (req,res)=>{
        try {
            var {id, teamName , person_1_email, person_2_email, person_3_email,mentorName,pptLink}=req.body
            const ECC=await ECCModel.findById(id)
            if(!ECC){
                return res.send({"status":"failed","message":"Given ID is incorrect ...."})
            }
            if(!person_1_email)person_1_email=ECC.other_person_1_email
            if(!person_2_email)person_2_email=ECC.other_person_2_email
            if(!person_3_email)person_3_email=ECC.other_person_3_email

            const user1=await userModel.findOne({email:person_1_email})
            const user2=await userModel.findOne({email:person_2_email})
            const user3=await userModel.findOne({email:person_3_email})

            if(!(typeof(teamName)=="undefined" || teamName )){
                res.send({"status":"failed","message":"teamName field not to be null ...."})      
            }
            else  if(!(typeof(pptLink)=="undefined" || pptLink )){
                res.send({"status":"failed","message":"pptLink field not to be null...."})      
            }
            else if(person_1_email && !user1){
                res.send({"status":"failed","message":"person_1 is not registered user...."})
            }
            else if(person_2_email && !user2){
                res.send({"status":"failed","message":"person_2 is not registered user...."})
            }
            else if(person_3_email && !user3){
                res.send({"status":"failed","message":"person_3 is not registered user...."})
            }
            else if((person_1_email &&((person_1_email===ECC.owner_email)||(person_1_email===person_2_email) || (person_1_email===person_3_email) ))||(person_2_email &&((person_2_email===ECC.owner_email) || (person_2_email === person_3_email) )) ||(person_3_email &&(person_3_email === ECC.owner_email ))){
                res.send({"status":"failed","message":"same email id is used OR register person email id used ...."})
            }  
            else{
                await ECCModel.findByIdAndUpdate(id,{$set:{
                    teamName:teamName,
                    other_person_1_email:person_1_email,
                    other_person_2_email:person_2_email,
                    other_person_3_email:person_3_email,
                    mentorName:mentorName,
                    pptLink:pptLink
                }})
                res.send({"status":"Success","message":"admin updated ECC compition profile sucessfully ..."})                          
            }   
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to update ECC...."})   
        }     
    }
    static deleteECC=async (req,res)=>{
        try {
            const id=req.query.id
            const ECC=await ECCModel.findById(id)
            if(!ECC){
                res.send({"status":"failed","message":"ECC compition id is incorrect...."})
            }
            else{
                await ECCModel.findByIdAndDelete(id)
                res.send({"status":"success","message":"delete ECC successfully..."})
            } 
        }    
        catch (error) {
                res.send({"status":"failed","message":"Unable to delete ECC...."})
        } 
    }
    static getAllECC=async (req,res)=>{
        try {
            const ECCs=await ECCModel.find()
            res.send({"status":"success","ECCs":ECCs})
        } catch (error) {
            res.send({"status":"failed","message":"Failed to get all ECCs ...."})
        }
    }
    static dynamicFilters=async (req,res)=>{
        try {
            const id=undefined;
            const filters = {};
            for (const key in req.query) {
                if(key==="person_email"){
                    const user=await userModel.findOne({email:person_1_email}) 
                    id=user._id;
                }
                else if (req.query[key].includes(',')) {
                    const values = req.query[key].split(','); 
                    filters[key] = { $gte: values[0], $lte: values[1] };
                } else if (req.query[key]) {    
                    filters[key] = req.query[key];
                }
            }
            const ECCs1=await ECCModel.find(filters)
            const ECCs=ECCs1 
            if (!(typeof myValue === 'undefined')) {
                ECCs=ECCs1.filter(obj => obj.person_1_id==id);
                ECCs=ECCs1.filter(obj => obj.person_2_id==id);
                ECCs=ECCs1.filter(obj => obj.person_3_id==id);
                ECCs=ECCs1.filter(obj => obj.person_4_id==id);    
            }
            res.send({"status":"success","ECCs":ECCs})       
        } catch (error) {
            res.send({"status":"failed","message":"Failed to filter ECCs ...."})
        }   
    }
    static loggedECC=async (req,res)=>{
        try {
            const ECCs=await ECCModel.find({owner_email:req.user.email})
            res.send({"status":"success","ECCs":ECCs})
        } catch (error) {
            res.send({"status":"failed","message":"Failed to get user ECCs ...."})
        }
    } 
    static updateECCByUser=async (req,res)=>{
        try {
            var {id, teamName , person_1_email, person_2_email, person_3_email,mentorName,pptLink}=req.body
            const ECC=await ECCModel.findById(id)
            if(!ECC){
                return res.send({"status":"failed","message":"Given ID is incorrect ...."})
            }
            if(ECC.owner_email !==req.user.email){
                return res.send({"status":"failed","message":"Given ECC ID is not belong to these user ...."})
            }
            
            if(!person_1_email)person_1_email=ECC.other_person_1_email
            if(!person_2_email)person_2_email=ECC.other_person_2_email
            if(!person_3_email)person_3_email=ECC.other_person_3_email
            const user1=await userModel.findOne({email:person_1_email})
            const user2=await userModel.findOne({email:person_2_email})
            const user3=await userModel.findOne({email:person_3_email})
            
            if(!(typeof(teamName)=="undefined" || teamName )){
                res.send({"status":"failed","message":"teamName field not to be null ...."})      
            }
            else  if(!(typeof(pptLink)=="undefined" || pptLink )){
                res.send({"status":"failed","message":"pptLink field not to be null...."})      
            }
            else if(person_1_email && !user1){
                res.send({"status":"failed","message":"person_1 is not registered user...."})
            }
            else if(person_2_email && !user2){
                res.send({"status":"failed","message":"person_2 is not registered user...."})
            }
            else if(person_3_email && !user3){
                res.send({"status":"failed","message":"person_3 is not registered user...."})
            }
            else if((person_1_email &&((person_1_email===req.user.email)||(person_1_email===person_2_email) || (person_1_email===person_3_email) ))||(person_2_email &&((person_2_email===req.user.email) || (person_2_email === person_3_email) )) ||(person_3_email &&(person_3_email === req.user._id ))){
                res.send({"status":"failed","message":"same email id is used OR register person email id used ...."})
            }  
            else{
                await ECCModel.findByIdAndUpdate(id,{$set:{
                    teamName:teamName,
                    other_person_1_email:person_1_email,
                    other_person_2_email:person_2_email,
                    other_person_3_email:person_3_email,
                    mentorName:mentorName,
                    pptLink:pptLink
                }})
                res.send({"status":"Success","message":"user updated ECC compition profile sucessfully ..."})                          
            }   
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to update ECC...."})   
        }
    } 
}

// export
export default ECCController;