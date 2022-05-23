const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwtlogin = require('../middleware/jwtlogin');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:id', jwtlogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id username')
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: 'User not found' });
    });
});

router.put('/follow', jwtlogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select('-password')
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
router.put('/unfollow', jwtlogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select('-password')
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
router.put('/updateProfile', jwtlogin, (req, res) => {
  const { username, pic, fullName, Bio } = req.body;
  User.findOne({ username: username })
    .then((result) => {
      if (result) {
        return res.status(422).json({ error: 'Username already exist' });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            pic,
            username,
            fullName,
            Bio,
          },
        },
        { new: true },
        (err, result) => {
          if (err) {
            return res.status(422).json({ error: 'pic canot post' });
          }
          res.json(result);
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post('/search-users', (req, res) => {
  let userPattern = new RegExp('^' + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select('_id email')
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
