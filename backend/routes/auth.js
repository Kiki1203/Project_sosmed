const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const bycrpt = require('bcryptjs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs/dist/bcrypt');
const JWT = require('jsonwebtoken');
const { JWT_P } = require('./../keys');
const jwtlogin = require('../middleware/jwtlogin');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ardiyad69@gmail.com', // Email Sender
    pass: 'dnzapryjeoypkxrj', // Key Generate
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get('/', (req, res) => {
  res.send('hello');
});

router.get('/protected', jwtlogin, (req, res) => {
  res.send('hello user');
});

router.post('/register', (req, res) => {
  console.log(req.body);
  const { username, email, password, pic, bio, fullName, confirmed, _id } = req.body;
  if (!username || !email || !password) {
    res.status(422).json({ error: 'Please add all the fields below' });
  }
  User.findOne({ username: username })
    .then((result) => {
      if (result) {
        return res.status(422).json({ error: 'Username already exist' });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  const token = JWT.sign({ _id }, JWT_P);
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'Email already exist' });
      }
      bcrypt.hash(password, 12).then((hashpassword) => {
        const user = new User({
          username,
          email,
          password: hashpassword,
          pic,
          bio,
          fullName,
          confirmed,
        });

        user
          .save()
          .then((user) => {
            transporter.sendMail({
              from: 'no-reply@socialme.com', // Sender Address
              to: user.email, // Email User
              subject: 'Email Confirmation',
              html: `
              <p>Verified account confirmation</p>
              <h5>click in this <a href="http://localhost:3000/login">link</a> to verify a account</h5>
              `,
            });
            res.json({ massage: 'Register Success! Check Email to Verified Account!' });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: 'please add email and password' });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: 'invalid email' });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMact) => {
        if (doMact) {
          const token = JWT.sign({ _id: savedUser._id }, JWT_P);
          const { _id, username, email, followers, following, pic, Bio, fullName } = savedUser;
          res.json({ token, user: { _id, username, email, followers, following, pic, Bio, fullName } });

          //   res.json({ massage: 'succesfuly login' });
        } else {
          return res.status(422).json({ error: 'invalid password' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'User dont exists with that email' });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: 'no-replay@socialme.com',
          subject: 'password reset',
          html: `
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                  `,
        });
        res.json({ message: 'check your email' });
      });
    });
  });
});

router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'Try again session expired' });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: 'password updated success' });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.get('/verify/:id/:token', async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id });
//     if (!user) return res.status(400).send('Invalid link');

//     const token = await token.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token) return res.status(400).send('Invalid link');

//     await User.updateOne({ _id: user._id, verified: true });
//     await token.findByIdAndRemove(token._id);

//     res.send('email verified sucessfully');
//     console.log(res);
//   } catch (error) {
//     res.status(400).send('An error occured');
//   }
// });

module.exports = router;
