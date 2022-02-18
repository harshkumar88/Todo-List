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
        lowercase:true
       

    },
    password:{
        type:String,
        required:true,
        trim:true
       
    },
    security:{
        type:String,
        unique:true
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
    if(this.isModified("security")){
        
        this.security= await bcrypt.hash(this.security,8)
        
        }
    if(this.isModified("password")){
        
    this.password= await bcrypt.hash(this.password,8)
    
    }
    next()
    
})


const Register=mongoose.model("Register",RegisterSchema)


const ListSchema=new mongoose.Schema({
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
        },
        id:{
            type:String
        }
       
})
const List= mongoose.model("todo",ListSchema)


const NotesSchema=new mongoose.Schema({
   mail:{
        type:String
    },
    notes:{
        type:String
    },
    subject:{
        type:String
    }

})
const Notes= mongoose.model("notes",NotesSchema)
module.exports={
    Register,List,Notes};