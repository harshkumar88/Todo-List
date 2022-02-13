require('dotenv').config()
const express=require("express")
const app=express()
const port=process.env.PORT||3000
const path=require("path")
const publicdirectoryPath=path.join(__dirname,'../public')
const registerRouter=require("./routers/register")
const hbs=require('hbs')
require("./db/mongoose")
app.set('view engine','hbs');
const cookieParser=require("cookie-parser")
const {auth,mail}=require('../middleware/auth')
const partialsPath=path.join(__dirname,'./partials')
//app.use(express.static(publicdirectoryPath))
hbs.registerPartials(partialsPath);

app.use(cookieParser())
app.use(registerRouter)

setInterval(()=>{
    mail()
},2000)

app.get("/",auth,(req,res)=>{
    try{
        req.user.tokens =req.user.tokens.find((stoken)=>{
            return stoken.token ==req.token
        })
        
        if(req.user.tokens){
            res.redirect("/todo-list")
        }
        else{
        res.render('login',{
            title:"Log In",
            name3:"Sign Up"
        })
    }
    }
    catch(e){
console.log(e)
    }
       
})
app.get("/forgot",(req,res)=>{
    res.render('forgot',{
        title:"forgot",
        name1:"Login"
    })
})
app.get("/logout",auth,async(req,res)=>{
    try{
        req.user.tokens =req.user.tokens.filter((stoken)=>{
            return stoken.token !=req.token
        })
        res.clearCookie("jwt")
        console.log("logout successfully")
        await req.user.save()
        res.render("login",{
            title:"login",
            name1:"Login"
        })
    }
    catch(error){
        res.status(500).send(error)
    }
})


/*app.get("/logoutfromall",auth,async(req,res)=>{
    try{
        
        req.user.tokens=[]
        res.clearCookie("jwt")
        console.log("logout successfully")
        await req.user.save()
        res.render("login",{
            title:"login",
            name1:"Login"
        })
    }
    catch(error){
        res.status(500).send(error)
    }
})
*/
app.get("/index",(req,res)=>{
    res.render('index',{
        title:"Sign Up",
        name1:"Login"
    })
})
app.get("/todo-list",auth,(req,res)=>{
    console.log("success")
})







app.listen(port,()=>{
    console.log("We are on port:",port)
})