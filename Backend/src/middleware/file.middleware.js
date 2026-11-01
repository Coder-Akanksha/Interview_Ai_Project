const multer =require("multer");

const upload =multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:3*1024*1024   // 3mb ki size hogi pdf ki
    }
})


module.exports=upload;