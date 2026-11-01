const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"usename already exists"],
        required:[true,"username is required"],
    },
    email:{
        type:String,
        unique:[true,"email already exists"],
        required:[true,"email is required"],
    },
    password:{
        type:String,
        required:[true,"password is required"],
    }

})

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;