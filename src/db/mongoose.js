const mongoose=require('mongoose')

const { default: isEmail } = require('validator/lib/isEmail')
const DB="mongodb+srv://Harshkumar:harshkumar88@cluster0.ffsv2.mongodb.net/Todo-List?retryWrites=true&w=majority"
mongoose.connect(process.env.MONGODB_URI||DB,{
}).then(()=>{
    console.log("connection successful")
}).catch((e)=>{
    console.log(e)
})




