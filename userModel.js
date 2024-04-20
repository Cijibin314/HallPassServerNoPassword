const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const blogSchema = new Schema({
  username: String,
  roomLeft: String,
  location: Object
});
  
module.exports = model('UserData', blogSchema)