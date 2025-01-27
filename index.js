const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const UserModel = mongoose.model("users", UserSchema);

app.get("/getUser", (req, res) => {
  UserModel.find({})
    .then(users => {
      res.json(users); // Send JSON response with users array
    })
    .catch(err => {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Failed to fetch users" }); // Send error response
    });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
