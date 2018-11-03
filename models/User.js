const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    passwdHash: String,
    votesCount: { type: Number, default: 0 },
  });
  
  mongoose.model('User', userSchema);