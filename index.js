const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const cookieSession = require("cookie-session");
const passport = require('passport');
const mongoose = require("mongoose");

require('./models/User');
require('./models/Vote');
require('./models/Cat');
mongoose.connect(config.mongoURI, {useNewUrlParser: true});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(
  cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [config.cookieKey]
  })
);
app.use(express.static('client/build'));
app.use(passport.initialize());
app.use(passport.session());

require('./services/passport.js');
require("./routes/auth.js")(app);
require("./routes/cats.js")(app);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
