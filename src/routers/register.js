const express=require("express")
const app=express()
const mongoose=require('mongoose');
const validator=require("validator")
const router=new express.Router()
const {Register,List}=require("../models/signup.js")
const hbs=require('hbs')
const { on } = require("../models/signup.js")
router.use(express.json())
router.use(express.urlencoded({extended:false}))
app.set('view engine','hbs');
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken");


router.post('/index',async(req,res)=>{
        try{
            const userdata= await Register.find({})
            
            const finduser=userdata.find((user)=>{
                return user.email===req.body.email
            })
            if(finduser){
                return res.render("index",{
                    user:"EMAIL ALready exist",
                    emailval:finduser.email
                })
            }
            else{
                if(!validator.isEmail(req.body.email)){
                    return res.render("index",{
                        user:"Not a Valid Email Address",
                        emailval:finduser.email
                    })
                }
            }
            
              
               
              const register=new Register({
                  email:req.body.email,
               password: req.body.password
            }
               
               )
               
               const token=await register.generateAuthToken()
                 
               res.cookie("jwt",token,{
                   expires:new Date(Date.now()+30000),
                   httpOnly:true
               })


              const registered=await register.save();

               res.render("index")
              

        }
        catch(e){
            console.log(e)
            return res.render("invalidregister",{
                error:"404"
            })
          
        }
})



//login

router.post("/login",async(req,res)=>{

     try{
         const userdata=await Register.find({})
         
         const datafind=userdata.find((user)=>{
             return user.email===req.body.email1
         })
    
        
         
         if(datafind){
            const isMatch= await bcrypt.compare(req.body.password1,datafind.password)
           
             if(isMatch){
                const token=await datafind.generateAuthToken()

                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+60000),
                    httpOnly:true,
                    //secure:true
                })
                
                
                return res.render("login",{
                    exist:"Successful"
                })
             }
             return res.render("login",{
                 exist:"No user found",
                 emailexist:req.body.email1
             })
         }

         return res.render("login",{
            exist:"No user found",
            emailexist:req.body.email1
        })

       

         
     }
     catch(e){
         res.render("invalidregister",{
             error:"404"
         })
     }

})

router.post("/todo-list",async(req,res)=>{
        try{
            const token=req.cookies.jwt;
            const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
            const user = await Register.findOne({_id:verifyUser._id})
            const dataadd=req.body.todo
            const hour=req.body.hour
            const min=req.body.min

            var now=new Date();
            var date=now.getDate();

             const list=new List({
                 data:dataadd,
                 variable:user.email,
                 hour:hour,
                 min:min,
                 date:date

                 
             })

             await list.save()
            const findlist= await List.find({variable:user.email})
            
            var arr=[];
            var hours=[];
            var minutes=[];
            findlist.forEach(function(list){
                arr.push(list.data)
                hours.push(list.hour)
                minutes.push(list.min)
            })
            console.log(arr,hours,minutes)
            if(findlist){
                return res.render("todo-list",{
                    data:arr,
                    title:"TOdo",
                    hour:hours,
                    min:minutes
                })
            }
           
            
             
            
                         

        
        }
        catch(e){
             return res.send("error")
        }
})

module.exports=router;