import "dotenv/config"
import express from "express"
import cors from "cors"
import { errorHandler } from "./utils/errorHandler";
import personaHandler from "./persona/persona.route"


const app= express()

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.json({message:"Up and running"})
})


app.use("/v1/persona",personaHandler);



app.use(errorHandler)


const PORT=process.env.PORT ??8080

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})