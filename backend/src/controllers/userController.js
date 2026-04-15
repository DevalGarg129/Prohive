const User = require('../models/User');
const Notification = require('../models/Notification');

// Get public profile by username
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username fullName avatar isVerified')
      .populate('following', 'username fullName avatar isVerified');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update current user's profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['fullName', 'bio', 'website', 'location', 'avatar', 'isPrivate'];
    const updates = {};
    allowed.forEach((k) => { if (k in req.body) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Follow / unfollow another user
exports.followUser = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const other = await User.findById(req.params.userId);
    if (!other) return res.status(404).json({ message: 'User not found' });

    const already = me.following.some((id) => id.toString() === other._id.toString());

    if (already) {
      me.following = me.following.filter((id) => id.toString() !== other._id.toString());
      other.followers = other.followers.filter((id) => id.toString() !== me._id.toString());
      await Promise.all([me.save(), other.save()]);
      return res.json({ following: false });
    }

    me.following.push(other._id);
    other.followers.push(me._id);
    await Promise.all([me.save(), other.save()]);

    // create notification
    await Notification.create({ recipient: other._id, sender: me._id, type: 'follow' });

    // emit real-time notification if io is available
    const io = req.app.get('io') || global.io;
    io?.to(`user:${other._id}`).emit('notification:new', { type: 'follow', from: me._id });

    res.json({ following: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Simple user search by q
exports.searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ users: [] });
    const re = new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    const users = await User.find({ $or: [{ username: re }, { fullName: re }] })
      .select('username fullName avatar isVerified')
      .limit(20);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
