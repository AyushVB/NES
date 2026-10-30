import express from "express"
import ECCController from "../controllers/ECC-Controller.js";
import checkUserAuth from "../middlewares/user-auth-middleware.js";
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

const ECCRoutes=express.Router();

// route level middleware
ECCRoutes.use('/createECC',checkUserAuth)
ECCRoutes.use('/loggedECC',checkUserAuth)
ECCRoutes.use('/updateECCByUser',checkUserAuth)

ECCRoutes.use('/updateECC',checkAdminAuth)
ECCRoutes.use('/deleteECC',checkAdminAuth)
ECCRoutes.use('/getAllECCs',checkAdminAuth)
ECCRoutes.use('/dynamicFilters',checkAdminAuth)



// protected routes
ECCRoutes.post('/createECC',ECCController.createECC)
ECCRoutes.patch('/updateECC',ECCController.updateECC)
ECCRoutes.delete('/deleteECC',ECCController.deleteECC)
ECCRoutes.get('/getAllECCs',ECCController.getAllECC)
ECCRoutes.get('/dynamicFilters',ECCController.dynamicFilters)
ECCRoutes.get('/loggedECC',ECCController.loggedECC)
ECCRoutes.patch('/updateECCByUser',ECCController.updateECCByUser)

// export
export default ECCRoutes
