// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true,
    trim: true, lowercase: true,
    minlength: 3, maxlength: 30,
    match: [/^[a-zA-Z0-9_.]+$/, 'Invalid username characters'],
  },
  email: {
    type: String, required: true, unique: true,
    trim: true, lowercase: true,
  },
  password: { type: String, required: true, minlength: 6, select: false },
  fullName: { type: String, required: true, trim: true, maxlength: 50 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 150 },
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
