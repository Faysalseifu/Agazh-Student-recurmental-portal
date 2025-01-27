const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost:27017/admin')

const UserSchema =mongoose.Schema({
    name: String,
    age: Number
})

const UserModel = mongoose.model("users", UserSchema)
app.get("/getUser", (req, res)=>{
   res.json(UserModel.find({}).then(function(users){
    res.json(users)
   })).catch(function(err){
    console.log(err);
   })

})
app.listen(3001, ()=>{
    console.log("Surer is running");
})