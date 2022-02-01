const jwt=require("jsonwebtoken")
const {Register,List}=require("../src/models/signup.js");


const auth= async(req,res,next)=>{
             try{
                  const token=req.cookies.jwt;
                  if(!token){
                    return res.render("invalidregister",{
                        error:"Get login first"
                    })
                  }
                  const verifyUser=jwt.verify(token,process.env.SECRET_KEY)

                  
                  const user = await Register.findOne({_id:verifyUser._id})
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
                    console.log(date)
                    const find= await List.find({variable:user.email})
                var list;
                    find.forEach(function(l){
                        if( l.date!=date){
                           list= List.deleteMany({$ne:{date:date}},function(err){
                                if(err){
                                    
                                    console.log(err)
                                }
                                else{
                                    console.log("successful")
                                    
                                }
                            })
                            
                            
                        }
                           else if(l.hour==h && l.min<m){
                               console.log(l.min)
                              
                                list=List.deleteMany({hour:h ,$lt:{min:m} },function(err){
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        console.log("successful")
                                    }
                                })
                           }
                    })
                      
                    const findlist= await List.find({variable:user.email})
                    console.log(findlist)
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
                  next()
             } 
             catch(e){
                 res.status(401).send(e)
             }
}
module.exports=auth;