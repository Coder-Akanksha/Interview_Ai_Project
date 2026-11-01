const mongoose=require("mongoose");

/**
 * - job description schema: String
 * - resume text:String
 * -Self description text:String
 * 
 * -matchScore: Number
 * 
 * -Technical questions :
 *    [{
 *      question: "",
 *      intension of interviewer: "",
 *      answer: "",
 *  }]
 * - Behavioral questions
 *     [{
 *      question: "",
 *      intension of interviewer: "",
 *      answer: "",
 *  }]
 * -skills gaps :[{
 *  skill: "",
 *   servrity: {
 * type: String,
 * enum: ["low", "medium", "high"],
 *  } 
 * }]
 * -preparation plans:[{
 *  day: Number,
 *  topic: String,
 *  tasks:[string]
 * }]
 */
const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intension is required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    }
},{
    _id:false
})

const behavioralQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intension is required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    }
},{
    _id:false
})


const skillGapSchema=new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"serverity is required"]
    }

},{
    _id:false
})

const preparationPlanSchema=new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    tasks:[{
        type:String,
        required:[true,"Task is required"]
    }]
},{
    _id:false
})


const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"job description is required"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
  technicalQuestions:[technicalQuestionSchema],
  behavioralQuestions:[behavioralQuestionSchema],
  skillGaps:[skillGapSchema],
  preparationPlan:[preparationPlanSchema],
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  }

},{
    timestamps:true
})

const interviewReportModel=mongoose.model("InterviewReport",interviewReportSchema);

module.exports=interviewReportModel;

 