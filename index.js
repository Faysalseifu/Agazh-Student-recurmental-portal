const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost:27017/admin')

const UserSchema =mongoose.Schema({
    name: String,
    age: Number
})

app.get("/getUser", (req, res)=>{

})
app.listen(3001, ()=>{
    console.log("Surer is running");
})