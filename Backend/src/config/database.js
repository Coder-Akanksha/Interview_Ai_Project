const mongoose=require("mongoose");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectToDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.log(err);
    }
}

module.exports=connectToDb;