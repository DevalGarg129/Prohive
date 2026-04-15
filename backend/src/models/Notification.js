// backend/src/models/Notification.js
const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'follow', 'save', 'mention'], required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

notifSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notifSchema);
