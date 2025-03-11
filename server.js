const express=require('express');
const app=express();
const env=require('dotenv').config();
const db=require('./config/db');
db();

app.get('/',(req,res)=>{
    res.send("hello");
})

app.listen(process.env.PORT,()=>{
    console.log(`Your Server is running succesfully on port number ${process.env.PORT}`);
})