const mongoose = require("mongoose");
const { Schema } = mongoose;

const catSchema = new Schema({
    url: String,
    id: String,
    voted: Number,
    name: String,
    lastVoting: Date
});

mongoose.model('Cat', catSchema);