import express from "express"
import foundersFusionController from "../controllers/foundersFusionController.js";
import checkUserAuth from "../middlewares/user-auth-middleware.js";
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

const foundersFusionRoutes=express.Router();

// route level middleware
foundersFusionRoutes.use('/createFoundersFusion',checkUserAuth)
foundersFusionRoutes.use('/loggedFoundersFusion',checkUserAuth)
foundersFusionRoutes.use('/updateFoundersFusionByUser',checkUserAuth)

foundersFusionRoutes.use('/updateFoundersFusion',checkAdminAuth)
foundersFusionRoutes.use('/deleteFoundersFusion',checkAdminAuth)
foundersFusionRoutes.use('/getAllFoundersFusions',checkAdminAuth)
foundersFusionRoutes.use('/dynamicFilters',checkAdminAuth)



// protected routes
foundersFusionRoutes.post('/createFoundersFusion',foundersFusionController.createFoundersFusion)
foundersFusionRoutes.patch('/updateFoundersFusion',foundersFusionController.updateFoundersFusion)
foundersFusionRoutes.delete('/deleteFoundersFusion',foundersFusionController.deleteFoundersFusion)
foundersFusionRoutes.get('/getAllFoundersFusions',foundersFusionController.getAllFoundersFusion)
foundersFusionRoutes.get('/dynamicFilters',foundersFusionController.dynamicFilters)
foundersFusionRoutes.get('/loggedFoundersFusion',foundersFusionController.loggedFoundersFusion)
foundersFusionRoutes.patch('/updateFoundersFusionByUser',foundersFusionController.updateFoundersFusionByUser)

// export
export default foundersFusionRoutes
