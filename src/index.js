const express=require("express");

const usersController=require("./controllers/user.controller");//change

const app=express();

app.use(express.json());

app.use("/users",usersController);//change


module.exports=app;