const JWT = require('jsonwebtoken');
const { JWT_P } = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //  authorization === Bearer
  if (!authorization) {
    res.status(401).json({ error: 'you must be logged in' });
  }
  const token = authorization.replace('Bearer ', '');
  JWT.verify(token, JWT_P, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'you must be logged in' });
    }

    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
