const jwt=require("jsonwebtoken")
const {Register,List}=require("../src/models/signup.js");
const url=require("url")


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
                            id:id

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
module.exports=auth;