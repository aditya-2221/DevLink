import dbConnect from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path:'./.env'
})

dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is listening at port :${process.env.PORT || 8000}`)
    })
    
})
.catch((error)=>{
    console.log("MONGODB connection failed !!!",error)
})
