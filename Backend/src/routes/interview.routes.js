const express=require("express");
const authMiddleware = require("../middleware/auth.middleware.js")
const interviewController=require("../controllers/interview.controller.js");
const upload=require("../middleware/file.middleware.js");

const interviewRouter=express.Router();


/**
 * @route POST /api//
 * @description generate new interview reoprt on the basis of user self description, resume pdf and job description.
 * @access private
 * 
 */

interviewRouter.post("/",authMiddleware.authMiddleware, upload.single("resume"), interviewController.generateInterviewReportController);



/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get("/report/:interviewId",authMiddleware.authMiddleware,interviewController.getInterviewReportByIdController)

/**
 * @route Get /api/interview/
 * @description get all interview report of logged in user
 * @access private
 */
   interviewRouter.get("/",authMiddleware.authMiddleware,interviewController.getAllInterviewReportController)


module.exports=interviewRouter;