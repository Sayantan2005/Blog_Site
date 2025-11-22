const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
       firstName:{
        type:String,
        required:true
       }, 
       lastName:{
        type:String,
        required:true
       }, 
       email:{
        type:String,
        required:true,
        unique:true
       }, 
       password:{
        type:String,
        required:[true,'Password is required']
       },
       bio:{
        type:String,
        default:""
       },
       occupation:{
        type:String,
        default:""
       },
       photoURL:{
        type:String,
        default:""
       },
       instagram:{
        type:String,
        default:""
       },
       linkedin:{
        type:String,
        default:""
       },
       facebook:{
        type:String,
        default:""
       },
       github:{
        type:String,
        default:""
       },
    },
{timestamps:true})

const User = mongoose.model("User",userSchema);

// TODO: we need to Hash the password before save in the DB and also use access TOken and Refresh token

module.exports = {User}
