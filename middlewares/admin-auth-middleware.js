import jwt from 'jsonwebtoken'
import adminModel from '../models/admin.js'

const checkAdminAuth= async(req,res,next)=>{
    const { authorization }=req.headers
    
    if(!(authorization && authorization.startsWith('Bearer'))){
        res.status(401).send({"status":"failed","message":"Unauthorized admin"})
    }
    else {
        const token=await authorization.split(' ')[1]
         
        // verify token
        jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,admin)=>{
            if (err) {
                return res.status(403).send({"status":"failed","message":"Authentication refused"})
            }
            else if(!(admin.type==="admin")){
                return res.status(403).send({"status":"failed","message":"Authentication refused"})
            }
            req.admin=await adminModel.findById(admin.adminID).select('-password')
            if(!req.admin){
                return res.status(403).send({"status":"failed","message":"Unauthorized admin "})
            }
            next();
        })
    }   
}

export default checkAdminAuth
