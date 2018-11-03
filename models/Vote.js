const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
  cats: [{
    _cat: { type: Schema.Types.ObjectId, ref: 'Cat' },
    voted: Number,
  }],
  winnerVotes: Number,
  voted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Vote', voteSchema);

