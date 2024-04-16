/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const mongoose = require('mongoose')
const path = require("path");
const UserModel = require("./userModel")
const cors = require('fastify-cors')

const connectionString = "mongodb+srv://coltonflather:Wonderful1!@userdatacluster.gskuflb.mongodb.net/"
mongoose.connect(connectionString);
// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

/*fastify.register(cors, {
    origin: true,  // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'HEAD', 'PATCH', 'DELETE'],  // Allow only ___ requests
    allowedHeaders: ['Content-Type'],  // Allow only specific headers
});*/

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */


//////////////////////////////////////////////////////////////////////////////THIS IS THE START OF THE REQUESTS////////////////////////////
//post requests
fastify.post('/add-user', (req, res) => {
  let body = req.body;
  const newUser = new UserModel(body);

  newUser.save().then((result) => {
      res.status(200).send(result);
  }).catch((error) => {
      res.status(400).send({ "userExists": false });
  });
});

fastify.post('/update-user/:username', (req, res) => {
  const username = req.params.username;
  const body = req.body;
  res.send(body)
  UserModel.findOneAndUpdate({username: username}, body, {new: true}).exec().then((result)=>{
    res.status(200);res.send(result)
  }).catch((error)=>{
    res.status(400); console.log(error)
  });
})

fastify.post('/replace-user/:username', (req, res) => {
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

fastify.put('/delete-user/:username', (req, res) => {
  const username = req.params.username;
  UserModel.findOneAndDelete({username:username}).exec().then((result)=>{
    res.status(200);res.send(result)
  }).catch((error)=>{
    res.status(400); console.log(error)
  });
})
//gets
fastify.get('/get-user/:username',(req,res)=>{
    const username = req.params.username
    UserModel.findOne({username: username}).exec().then((result)=>{
      res.status(200);res.send(result)
    }).catch(err=>res.send(err));
})

//testing
fastify.post('/test', (req, res) => {
  const body = req.body;
  res.send(body);
})
fastify.get('/test', (req, res) => {
  res.status(200).send("this worked");
})
// monitors

fastify.head('/monitor', (req,res)=>{
  return "success"
})
fastify.get('/monitor', (req,res)=>{
  return "success"
})
fastify.post('/monitor', (req,res)=>{
  return "success"
})
fastify.put('/monitor', (req,res)=>{
  return "success"
})
fastify.patch('/monitor', (req,res)=>{
  return "success"
})
fastify.delete('/monitor', (req,res)=>{
  return "success"
})

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
