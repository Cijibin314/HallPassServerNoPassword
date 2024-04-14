// fastify stuff:

const path = require("path");

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

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

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

//end of fastify stuff

const mongoose = require('mongoose');
const UserModel = require('./userModel');

const connectionString = "mongodb+srv://coltonflather:Wonderful1!@userdatacluster.gskuflb.mongodb.net/"
mongoose.connect(connectionString);

//post requests
fastify.post('/add-user', (req, res) => {
  let body = req.body;
  const newUser = new UserModel(body);

  newUser.save().then((result) => {
      //res.status(200).send(result);
      return result;
  }).catch((error) => {
      //res.status(400).send({ "userExists": false });
      return "error"
  });
});

fastify.post('/update-user/:username', (req, res) => {
  const username = req.params.username;
  const body = req.body;
  //res.send(body)
  UserModel.findOneAndUpdate({username: username}, body, {new: true}).exec().then((result)=>{
    //res.status(200);res.send(result)
    return result;
  }).catch((error)=>{
    //res.status(400); console.log(error)
    return "error"
  });
})

fastify.post('/replace-user/:username', (req, res) => {
  const username = req.params.username;
  const body = req.body;
  //res.send(body)
  UserModel.findOneAndReplace({username: username}, body, {new: true}).exec().then((result)=>{
    //res.status(200);res.send(result)
    return result;
  }).catch((error)=>{
    //res.status(400); console.log(error)
    return "error"
  });
})
//puts

fastify.put('/delete-user/:username', (req, res) => {
  const username = req.params.username;
  UserModel.findOneAndDelete({username:username}).exec().then((result)=>{
    //res.status(200);res.send(result)
    return result;
  }).catch((error)=>{
    //res.status(400); console.log(error)
    return "error"
  });
})
//gets
fastify.get('/get-user/:username',(req,res)=>{
    const username = req.params.username
    UserModel.findOne({username: username}).exec().then((result)=>{
      //res.status(200);res.send(result)
      return result;
    }).catch(err=>{
        return err
    });
})

//testing
fastify.post('/', (req, res) => {
  const body = req.body;
  //res.send(body);
  return body;
})
fastify.get('/', (req, res) => {
  return {"this worked":true}
})