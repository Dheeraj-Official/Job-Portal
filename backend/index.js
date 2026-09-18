import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import userRoute from './routes/user.routes.js'
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/job.routes.js"
import applicationRoute from "./routes/application.routes.js"
import path from "path";
import fs from "fs";

dotenv.config({})

const app = express();
const _dirname = path.resolve();

// middlewares
app.set("trust proxy", 1); 
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"));
app.use(cookieParser());

const corsOption ={
    origin: ["https://jobpoartal-3.onrender.com", "http://localhost:8000"],
    credentials :true
}
app.use(cors(corsOption));


const PORT = process.env.PORT || 8000;

// api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);

const frontendDistPath = path.join(_dirname, "..", "frontend", "dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, "index.html"));
  });
}


app.listen(PORT, ()=>{
    connectDB();
    console.log(`server is running at port ${PORT}`);
})