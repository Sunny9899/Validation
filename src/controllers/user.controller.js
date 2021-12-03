const express=require("express");

const { body, validationResult } = require('express-validator');

const Product=require("../models/user.model");

const router = express.Router();
//



router.post("/"

// 1 first_name validation
,body("first_name").notEmpty().withMessage("First Name is required") 

// 2 last_name validation
,body("last_name").notEmpty().withMessage("Last Name is required") 

// 3 email validation 
,body("email").notEmpty().withMessage("Email is required").custom(async (value)=>{// email check on 2 parameters

    //1  whether provided value is email or not (Format Check)
    const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value); 
    if(!isEmail){
        throw new Error("Please enter a proper email");
    }

    //2  whether provided email already exists or not (Unique Mail Check)
    const productByEmail = await Product.findOne({email:value}).lean().exec();
    if(productByEmail){
        throw new Error("Email already exists");
    }    
    return true;
})


// 4 pincode validation
,body("pincode").custom(value=>{
    
    const isNumber = /^[0-9]*$/.test(value); 
    if(!isNumber || value <=0){
        throw new Error("Pincode cannot be 0 or negative or alphabetical");
    }
 
   // give pincode as a string or the length wont work
    if(isNumber && value.length!=6){
         throw new Error("Pincode should be exactly 6 digits long")
    }
    return true;
})


//5 age validation
,body("age").custom(async(value)=>{

if(value === ""){
    throw new Error("Age required");
}

if(value< 1 || value>100){
     throw new Error("Age not between 1 & 100");
}
return true;
})


//6 gender validation
,body("gender").custom(async(value)=>{

    if(value === ""){
        throw new Error("Gender required");
    }
    
    if(value!="M" && value!="F" && value!="Others"){
        throw new Error("Gender Invalid");
    }
    return true;
}),

async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newErrors=errors.array().map(err=>err.msg)
      return res.status(400).json({ errors: newErrors });
    }
    try{
        const product=await Product.create(req.body);
        return res.status(201).json({product});
    }
    catch(e){
        return res.status(500).json({status:"failed",message:e.message});
    }   
})


module.exports=router;