import express from "express"
import userController from "../controllers/userControllers.js";
import checkUserAuth from "../middlewares/user-auth-middleware.js";
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

const userRoutes=express.Router();

// user route level middleware
userRoutes.use('/updateUser',checkUserAuth)
userRoutes.use('/loggeduser',checkUserAuth)

// admin route level middleware
userRoutes.use('/deleteUser',checkAdminAuth)
userRoutes.use('/getAllUsers',checkAdminAuth)

// Public routes
userRoutes.post('/register',userController.userRegistration)
userRoutes.post('/login',userController.userLogin)
userRoutes.post('/sent-reset-password-email',userController.sendUserPasswordResetEmail)
userRoutes.patch('/reset-password/:id/:token',userController.userPasswordReset)

// protected routes by user token
userRoutes.patch('/updateUser',userController.updateUser)
userRoutes.get('/loggeduser',userController.loggedUser)

// protected routes by admin token
userRoutes.delete('/deleteUser',userController.deleteUser)
userRoutes.get('/getAllUsers',userController.getAllUser)

// export
export default userRoutes