const mongoose=require('mongoose');
const { stringify } = require('querystring');
const validator=require('validator')
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
const { time } = require('console');

const RegisterSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Must input a valid email")
            }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

RegisterSchema.methods.generateAuthToken=async function(){
           try{
               const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
               this.tokens=this.tokens.concat({token})
               await this.save();
               return token

           }
           catch(e){
               res.send(e)
           }
}

//password hashing
RegisterSchema.pre("save",async function(next){
    if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password,8)
    }
    next()
    
})

const Register=mongoose.model("Register",RegisterSchema)

const List= mongoose.model("todo",{
    data:{
        type:String,
        
    },
    variable:{
        type:String
    },
    hour:{
         type:String
    },
    min:{
           type:String
    },
    date:{
        type:String
    }
})
module.exports={
    Register,List};