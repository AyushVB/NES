import express from "express"
import CSuiteController from "../controllers/CSuiteController.js";
import checkUserAuth from "../middlewares/user-auth-middleware.js";
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

const CSuiteRoutes=express.Router();

// route level middleware
CSuiteRoutes.use('/createCSuite',checkUserAuth)
CSuiteRoutes.use('/loggedCSuite',checkUserAuth)

CSuiteRoutes.use('/deleteCSuite',checkAdminAuth)
CSuiteRoutes.use('/getAllCSuites',checkAdminAuth)
CSuiteRoutes.use('/dynamicFilters',checkAdminAuth)



// protected routes
CSuiteRoutes.post('/createCSuite',CSuiteController.createCSuite)
CSuiteRoutes.delete('/deleteCSuite',CSuiteController.deleteCSuite)
CSuiteRoutes.get('/getAllCSuites',CSuiteController.getAllCSuite)
CSuiteRoutes.get('/dynamicFilters',CSuiteController.dynamicFilters)
CSuiteRoutes.get('/loggedCSuite',CSuiteController.loggedCSuite)

// export
export default CSuiteRoutes
