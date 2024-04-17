const express = require('express')
const mongoose = require('mongoose');
const UserModel = require('./userModel');
const cors = require('cors');

const app = express();

//middleware
app.use(express.json())
app.use(cors())

const connectionString = "mongodb+srv://coltonflather:Wonderful1!@userdatacluster.gskuflb.mongodb.net/"
mongoose.connect(connectionString);
const port = process.env.PORT || 3000;

//post requests
app.post('/add-user', (req, res) => {
  let body = req.body;
  const newUser = new UserModel(body);

  newUser.save().then((result) => {
      res.status(200).send(result);
  }).catch((error) => {
      res.status(400).send({ "userExists": false });
  });
});

app.post('/update-user/:username', (req, res) => {
  const username = req.params.username;
  const body = req.body;
  res.send(body)
  UserModel.findOneAndUpdate({username: username}, body, {new: true}).exec().then((result)=>{
    res.status(200);res.send(result)
  }).catch((error)=>{
    res.status(400); console.log(error)
  });
})

app.post('/replace-user/:username', (req, res) => {
  const username = req.params.username;
  const body = req.body;
  res.send(body)
  UserModel.findOneAndReplace({username: username}, body, {new: true}).exec().then((result)=>{
    res.status(200);res.send(result)
  }).catch((error)=>{
    res.status(400); console.log(error)
  });
})
//puts

app.put('/delete-user/:username', (req, res) => {
  const username = req.params.username;
  UserModel.findOneAndDelete({username:username}).exec().then((result)=>{
    res.status(200);res.send(result)
  }).catch((error)=>{
    res.status(400); console.log(error)
  });
})
//gets
app.get('/get-user/:username',(req,res)=>{
    const username = req.params.username
    UserModel.findOne({username: username}).exec().then((result)=>{
      res.status(200);res.send(result)
    }).catch(err=>res.send(err));
})

//testing
app.post('/test', (req, res) => {
  const body = req.body;
  res.send(body);
})
app.get('/test', (req, res) => {
  res.status(200).send("this worked");
})

// monitoring
app.get('/monitor', (req,res)=>{res.status(200).send("success")})
app.head('/monitor', (req,res)=>{res.status(200).send("success")})


//start server
app.listen(3000, ()=>{console.log("server is running on port " + port)});