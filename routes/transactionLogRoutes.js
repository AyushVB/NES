import express from "express"
import transactionLogController from "../controllers/transactionLogControllers.js";
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

const transactionLogRoutes=express.Router();

// route level middleware
transactionLogRoutes.use('/getAllTransactionLogs',checkAdminAuth)
transactionLogRoutes.use('/dynamicFilters',checkAdminAuth)

// protected routes
transactionLogRoutes.get('/getAllTransactionLogs',transactionLogController.getAllTransactionLog)
transactionLogRoutes.get('/dynamicFilters',transactionLogController.dynamicFilters)

// export
export default transactionLogRoutes
