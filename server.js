import express from "express";
import dotenv from "dotenv";
import httpError from "./middleware/httpError.js";
import connectDB from "./config/db.js";
import userRouter from "./router/userRouter.js"

dotenv.config({path:"./.env"})


console.log("port",process.env.PORT)


const app = express();
app.use(express.json());

app.use("/user",userRouter);

app.get("/",(req,res)=>{

    res.json("hello from server")

})

app.use((req,res,next)=>{

    return next(new httpError("request route not found",404))

})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    res.status(error.statusCode || 500).json({
        success: true,
        message: error.message || "Internal server error"
    });
});



const port = process.env.PORT || 5000;



async function  startServer() {

    try {

        const connect = await connectDB();

        if(!connect){
            throw new Error("failed to connect db")
        }
        
        app.listen(port,(error)=>{

            if(error){
               return console.log(error.message)
            }

            console.log(`server running on port ${port}`)

        })

    } catch (error) {
        console.log(error.message)
    }
    
}

startServer();