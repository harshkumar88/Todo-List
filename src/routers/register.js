const express=require("express")
const app=express()
const mongoose=require('mongoose');
const validator=require("validator")
const router=new express.Router()
const {Register,List,Notes}=require("../models/signup.js")
const hbs=require('hbs')
const { on } = require("../models/signup.js")
router.use(express.json())
router.use(express.urlencoded({extended:false}))
app.set('view engine','hbs');
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken");
const {v4 : uuidv4} = require('uuid')
const originalUrl=require("url")
const fetch=require("node-fetch")

const sendmail=require("./send.js");
const { nextTick } = require("process");

router.post('/index',async(req,res)=>{
        try{
            const userdata= await Register.find({})
            
            const finduser=userdata.find((user)=>{
                return user.email===req.body.email
            })
            const findpin=userdata.find((user)=>{
                return user.email===req.body.security
            })
            if(finduser){
                return res.render("index",{
                    user:"EMAIL ALready exist",
                    emailval:finduser.email
                })
            }
            else if(findpin){
                return res.render("index",{
                    pin:"PIN already exist"
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
            
              
               
            
                sendmail(req.body.email,"Register","you are Succesfully registered ")
            
            const register=new Register({
               firstname:req.body.firstname,
               secondname:req.body.lastname,
               email:req.body.email,
               password: req.body.password,
               security:req.body.security
            }
               
               )
                             
              const first=req.body.firstname;
              const second=req.body.lastname;

              const registered=await register.save();
              sendmail(req.body.email,"Register",first+" "+second+"<br>"+"You are succesfully register")
              sendmail("harshkumartodolist1@gmail.com","Register",first+" "+second+"<br>"+req.body.email+"<br>"+"Register their Account with you.")
              return res.redirect("/")
              

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
                    expires:new Date(Date.now()+10000000),
                    httpOnly:true,
                    //secure:true
                })
                sendmail(req.body.email1,"Login","you are Succesfully Login ")
                
                return res.redirect('/todo-list')
                
             }
             sendmail(req.body.email1,"Login","Someone is trying to access your ")
             return res.render("login",{
                 exist:"No user found",
                 emailexist:req.body.email1,
                 name3:"Sign Up"
             })
         }
         sendmail(req.body.email1,"Login","Someone is trying to access your ")
         return res.render("login",{
            exist:"No user found",
            emailexist:req.body.email1,
            name3:"Sign Up"
        })

       

         
     }
     catch(e){
         res.render("invalidregister",{
             error:"404"
         })
     }

})

router.post("/forgot",async(req,res)=>{

    try{
        const userdata=await Register.find({})
        
        const datafind=userdata.find((user)=>{
            return user.email===req.body.email2
        })
        
   
        const isMatch= await bcrypt.compare(req.body.security1,datafind.security)
       if(datafind && isMatch){
           await Register.findOneAndUpdate({security:req.body.security1},{
               $set:{
                password:await bcrypt.hash(req.body.password2,8)
               }
               
           })
           return res.render("login",{
               title:"login",
               name3:"Sign Up"
           })
       }
       else{
           res.render("forgot",{
               exist:"User Not Exist",
               name3:"Sign Up"
           });
       }
        

        
    }
    catch(e){
        res.render("invalidregister",{
            error:"404",
            name1:"Login"
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
            let h=now.getHours();
            let m=now.getMinutes();
             
            if(h>hour){
                   return res.render("todo-list",{
                       msg:"pls enter a time which is not in past"
                   })
            }
            else if(h==hour && m>min ){
                return res.render("todo-list",{
                    msg:"Not enter Past time"
                })
            }
           else{
            const newId = uuidv4()
             const list=new List({
                 data:dataadd,
                 variable:user.email,
                 hour:hour,
                 min:min,
                 date:date,
                 id:newId


                 
             })

             await list.save()
             const findlist= await List.find({variable:user.email}).sort({hour:1,min:1})
            
            var arr=[];
            var hours=[];
            var minutes=[];
            var id=[];
            findlist.forEach(function(list){
                arr.push(list.data)
                hours.push(list.hour)
                minutes.push(list.min)
                id.push(list.id)
            })
            console.log(arr,hours,minutes)
            if(findlist){
                return res.render("todo-list",{
                    data:arr,
                    title:"Todo",
                    name2:"logout",
                    hour:hours,
                    min:minutes,
                    id:id
                })
            }
           
            
             
        }
                         

        
        }
        catch(e){
            return res.render("invalidregister",{
                error:"404",
                
            })
        }
})


router.post("/delete",async(req,res)=>{
    try{
        const i=req.body.checkbox;
        console.log(i)
        List.findOneAndDelete({id:i},function(err,docs){
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted User : ", docs);
            }
        })

        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
        const user = await Register.findOne({_id:verifyUser._id})
        const findlist= await List.find({variable:user.email}).sort({hour:1,min:1})
            
        var arr=[];
        var hours=[];
        var minutes=[];
        var id=[];
        findlist.forEach(function(list){
            arr.push(list.data)
            hours.push(list.hour)
            minutes.push(list.min)
            id.push(list.id)
        })
        console.log(arr,hours,minutes)
        if(findlist){
            return res.render("todo-list",{
                data:arr,
                title:"Todo",
                hour:hours,
                min:minutes,
                id:id,
                name2:"Logout"
            })
        }
       
        
         
    }
                     
    catch(e){
        return res.render("invalidregister",{
            error:"404",
            
        })
    }
})



router.post("/notes",async(req,res)=>{

    try{
        console.log(req.body.sub)
        
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
        const user = await Register.findOne({_id:verifyUser._id})

        console.log(user.email)
     const you=Notes.findOneAndDelete({mail:user.email,subject:req.body.sub},function(err,docs){
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted User : ", docs);
        }
     });
     if(req.body.sub!=''){
        
    const notes=new Notes({
         mail:user.email,
         notes:req.body.text,
         subject:req.body.sub
     })
     await notes.save();
    }
        
     const note=await Notes.find({mail:user.email})
   
      var arr=[];
      var sub=[];
     note.forEach((n)=>{
        arr.push(n.notes)
        sub.push(n.subject)
     })
     console.log(arr,sub)
     res.render("notes",{
        title:"Notes",
        data:arr,
        subject:sub,
        name2:"Logout"
    })
     
 
    }
    catch(e){
   console.log(e)
    }
})

module.exports=router;