const jwt=require("jsonwebtoken")
const {Register,List,Notes}=require("../src/models/signup.js");
const url=require("url")
var nodemailer = require('nodemailer');
const sendmail=require("../src/routers/send.js")
const dateTime = require('node-datetime');
const auth= async(req,res,next)=>{
             try{
                 const urlobject=url.parse(req.url,true)
                 const path=urlobject.pathname
                   
                 
                  const token=req.cookies.jwt;
                  if(!token){
                      if(path=='/'){
                        return res.render('login',{
                            title:"Log In",
                            name3:"Sign Up"
                        })
                      }
                    return res.render("invalidregister",{
                        error:"404",
                        name1:"Login",
                        err:"Get Login First"

                    })
                  }
                  const verifyUser=jwt.verify(token,process.env.SECRET_KEY)

                  
                  const user = await Register.findOne({_id:verifyUser._id})
                  req.token=token
                  req.user=user
                  if(path=="/logout" || path=="/logoutfromall" || path=='/'){
                      next()
                      return;
                  }

                  if(user){
                    var months=[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "June",
                        "July",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                    ];
                    var now=new Date();
                    var month=months[now.getMonth()];
                    var date=now.getDate();
                    let h=now.getHours();
                    let m=now.getMinutes();
                    console.log("hour: ",h,"min:",m)
                    const find= await List.find({variable:user.email})
                
                    find.forEach(function(l){
                        if( l.date!=date){
                            console.log("date")
                            List.deleteMany({$ne:{date:date}},function(err){
                                if(err){
                                    
                                    console.log(err)
                                }
                                else{
                                    console.log("successful")
                                    
                                }
                            })
                            
                            
                        }
                           
                    })
                      
                   
                    const findlist= await List.find({variable:user.email}).sort({hour:1,min:1})
                    console.log(findlist)
                    var n=[];
                    n.push(user.firstname);
                    n.push(user.secondname)
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
                   
                    if(findlist){
                        return res.render("todo-list",{
                            data:arr,
                            title:"TOdo",
                            hour:hours,
                            min:minutes,
                            name2:"Logout",
                            id:id,
                            n:n
                            

                        })
                    }
                  }
                  next()
             } 
             catch(e){
                return res.render("invalidregister",{
                    error:"404",
                    
                })
             }
}

var notarray=[];
const mail= async(req,res,next)=>{
      try{
            console.log("mail")
             var now=new Date();
            var date=now.getDate();
            let h=now.getHours();
            let m=now.getMinutes();
            h=h+5;
            m=m+30;
            if(m>=60){
                m-=60;
                h+=1;
            }
        
        
      const users=await Register.find({})
      var useremail=[];
      users.forEach((user)=>{
           useremail.push(user.email)
      })

      

      useremail.forEach(async(user)=>{
          var tasks=[];
          var hour=[];
          var min=[];
        const todo=await List.find({variable:user})
       
            todo.forEach((to)=>{
                tasks.push(to.data)
                hour.push(to.hour)
                min.push(to.min)
            })
            if(tasks.length!=0){
                
                for(var i=0;i<tasks.length;i++){
                    if(hour[i]==h && min[i]==m){
                        sendmail(user,"Your pending Work",tasks[i])
                        console.log("fine",h,m)
                        
            
                    }
                }
             

            }
            
        
           
          
      })
      

      }
      catch(e){

      }
}

const change=async(req,res,next)=>{
        
    try{
      
        const urlobject=url.parse(req.url,true)
        const path=urlobject.pathname
          
        
         const token=req.cookies.jwt;
         if(!token){
             if(path=='/'){
               return res.render('login',{
                   title:"Log In",
                   name3:"Sign Up"
               })
             }
           return res.render("invalidregister",{
               error:"404",
               name1:"Login",
               err:"Get Login First"

           })
         }
         const verifyUser=jwt.verify(token,process.env.SECRET_KEY)

         
         const user = await Register.findOne({_id:verifyUser._id})
         req.token=token
         req.user=user
         if(path=="/logout" || path=="/logoutfromall" || path=='/'){
             next()
             return;
         }

         
  
         
         
         const note=await Notes.find({mail:user.email})
   
      var arr=[];
      var sub=[];
      var n=[];
                    n.push(user.firstname);
                    n.push(user.secondname)
     note.forEach((n)=>{
        arr.push(n.notes)
        sub.push(n.subject)
     })
     console.log(arr,sub)
     res.render("notes",{
         title:"Notes",
         data:arr,
         subject:sub,
         name2:"Logout",
         n:n
     })
     next();
    }
    catch(e){
         
    }
}

module.exports={auth,mail,change};