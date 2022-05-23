const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { PORT } = require('./keys');
const { MONGOURL } = require('./keys');

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connect(MONGOURL);
mongoose.connection.on('connected', () => {
  console.log('Conneted to mongodb');
});
mongoose.connection.on('error', (err) => {
  console.log('Cannot conneted to mongo', err);
});

app.listen(PORT, (req, res) => {
  console.log('server is running on', PORT);
});
