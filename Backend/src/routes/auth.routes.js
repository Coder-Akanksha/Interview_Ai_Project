const express=require("express");
const authController=require("../controllers/auth.controller.js");
const authRouter=express.Router();
const authMiddleware=require("../middleware/auth.middleware.js");

/**
 * @ route POST /api/auth/register
 * @ description Register a new user
 * @ access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @ route POST /api/auth/login
    * @ description Login a user with email and password
    * @ access Public
 */

authRouter.post("/login", authController.loginController);


/**
 * @ route get /api/auth/logout
 * @ description clear token from cookie and add it to blacklist
 * @ access Public
 */

authRouter.get("/logout", authController.logoutController);


/**
 * @ route get /api/auth/get-user
 * @ description get the current logged in  user's details
 * @ access Private
 */

authRouter.get("/get-user",authMiddleware.authMiddleware,authController.getUserController); 


module.exports=authRouter;