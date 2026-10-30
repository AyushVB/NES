import express from "express"
import adminController from "../controllers/adminController.js";
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

const adminRoutes=express.Router();

// route level middleware
adminRoutes.use('/changepassword',checkAdminAuth)
adminRoutes.use('/loggedadmin',checkAdminAuth)

// Public routes
adminRoutes.post('/register',adminController.adminRegistration)
adminRoutes.post('/login',adminController.adminLogin)
adminRoutes.post('/sent-reset-password-email',adminController.sendAdminPasswordResetEmail)
adminRoutes.patch('/reset-password/:id/:token',adminController.adminPasswordReset)

// protected routes
adminRoutes.patch('/changepassword',adminController.changeAdminPassword)
adminRoutes.get('/loggedadmin',adminController.loggedAdmin)


// export
export default adminRoutes