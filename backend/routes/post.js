const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwtlogin = require('../middleware/jwtlogin');
const Post = mongoose.model('Post');

router.get('/allpost', jwtlogin, (req, res) => {
  Post.find()
    .populate('postedBy', '_id username')
    .populate('comments.postedBy', '_id username')
    .sort('-createdAt')
    .skip(req)
    .limit(req * 5)
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/postdetail/:id', jwtlogin, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate('postedBy', '_id username')
    .populate('comments.postedBy', '_id username')
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/getsubpost', jwtlogin, (req, res) => {
  // if postedBy in following
  Post.find({ postedBy: { $in: req.user.following } })
    .populate('postedBy', '_id username')
    .populate('comments.postedBy', '_id username')
    .sort('-createdAt')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/createpost', jwtlogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: 'Plase add all the fields' });
  }

  req.user.password = undefined;

  const post = new Post({
    title,
    body,
    Photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/mypost', jwtlogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id username')
    .sort('-createdAt')
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put('/like', jwtlogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate('postedBy', '_id username')
    .populate('comments.postedBy', '_id username')
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put('/unlike', jwtlogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate('postedBy', '_id username')
    .populate('comments.postedBy', '_id username')
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
router.put('/comment', jwtlogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate('comments.postedBy', '_id username')
    .populate('postedBy', '_id username')
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete('/deletepost/:postId', jwtlogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
