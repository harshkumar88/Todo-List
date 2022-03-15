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
const {auth,mail,change}=require('../middleware/auth')
const partialsPath=path.join(__dirname,'./partials')
//app.use(express.static(publicdirectoryPath))
hbs.registerPartials(partialsPath);
const webpush = require('web-push');

//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(cookieParser())
app.use(registerRouter)
app.use(express.static(path.join(__dirname, "client")));

mail();
setInterval(()=>{
    mail()
},60000)



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


app.get("/notes",change,(req,res)=>{
   
    console.log("success")
})


app.get("/*",(req,res)=>{
    res.render("invalidregister",{
        error:"404",
        name1:"Login",
        err:"Page not found"
    })
})


const publicVapidKey = 'BFGvRdujOYr5xrnNTPwyoGDapjUjrBVMZ_JCb3OPudbkewAbN7gq377HgvbXUW5iXzhN7rXbyiya6WJcjjc2Ni8';
const privateVapidKey = 'KFnYE_ShbG8emME5EQfYZtXgmIBuYstxoN64wfaUzpo';

//setting vapid keys details
webpush.setVapidDetails('mailto:mercymeave@section.com', publicVapidKey,privateVapidKey);
app.post('/subscribe', (req, res)=>{
    //get push subscription object from the request
    const subscription = req.body;

    //send status 201 for the request
    res.status(201).json({})

    //create paylod: specified the detals of the push notification
    const payload = JSON.stringify({title: 'Section.io Push Notification' });

    //pass the object into sendNotification fucntion and catch any error
    webpush.sendNotification(subscription, payload).catch(err=> console.error(err));
})

app.listen(port,()=>{
    console.log("We are on port:",port)
})