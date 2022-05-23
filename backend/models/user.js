const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    username: {
      type: 'String',
      required: true,
    },
    email: {
      type: 'String',
      required: true,
    },
    password: {
      type: 'String',
      required: true,
    },
    Bio: {
      type: 'String',
      default: 'saya pengguna sosialme',
    },
    fullName: {
      type: 'String',
      default: 'Belum ada nama',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetToken: String,
    expireToken: Date,
    pic: {
      type: String,
      default: 'https://res.cloudinary.com/dpifptkbz/image/upload/v1652854612/no_image_keqork.jpg',
    },

    followers: [{ type: ObjectId, ref: 'User' }],
    following: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
