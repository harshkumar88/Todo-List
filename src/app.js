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
const auth=require('../middleware/auth')
const partialsPath=path.join(__dirname,'./partials')
//app.use(express.static(publicdirectoryPath))
hbs.registerPartials(partialsPath);

app.use(cookieParser())
app.use(registerRouter)



app.get("/",(req,res)=>{
       res.render('login',{
           title:"Log In"
       })
})
app.get("/index",(req,res)=>{
    res.render('index',{
        title:"Sign Up"
    })
})
app.get("/todo-list",auth,(req,res)=>{
    
})







app.listen(port,()=>{
    console.log("We are on port:",port)
})