// backend/src/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

const withFlags = (post, userId) => {
  const obj = post.toObject ? post.toObject() : post;
  obj.isLiked = obj.likes.some((id) => id.toString() === userId?.toString());
  obj.isSaved = false; // resolved per user below if needed
  return obj;
};

// ── Create post ────────────────────────────────────────────────────────────────
exports.createPost = async (req, res) => {
  try {
    const { content, images, tags, location, visibility } = req.body;
    if (!content?.trim() && (!images || images.length === 0)) {
      return res.status(400).json({ message: 'Post must have content or at least one image' });
    }
    const post = await Post.create({
      author: req.user._id,
      content: content || '',
      images: images || [],
      tags: tags || [],
      location: location || '',
      visibility: visibility || 'public',
    });
    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });
    const populated = await Post.findById(post._id).populate('author', 'username fullName avatar isVerified');
    res.status(201).json({ post: withFlags(populated, req.user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Feed ──────────────────────────────────────────────────────────────────────
exports.getFeed = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const me = await User.findById(req.user._id).select('following savedPosts');
    const ids = [...(me.following || []), req.user._id];

    const [posts, total] = await Promise.all([
      Post.find({ author: { $in: ids }, visibility: { $ne: 'private' } })
        .sort({ createdAt: -1 }).skip(skip).limit(limit)
        .populate('author', 'username fullName avatar isVerified')
        .populate('comments.user', 'username fullName avatar'),
      Post.countDocuments({ author: { $in: ids }, visibility: { $ne: 'private' } }),
    ]);

    const savedSet = new Set((me.savedPosts || []).map(String));
    const result = posts.map((p) => {
      const obj = withFlags(p, req.user._id);
      obj.isSaved = savedSet.has(p._id.toString());
      return obj;
    });

    res.json({ posts: result, page, hasMore: skip + posts.length < total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Explore ───────────────────────────────────────────────────────────────────
exports.getExplore = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 12;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ visibility: 'public' })
      .sort({ 'likes': -1, createdAt: -1 })
      .skip(skip).limit(limit)
      .populate('author', 'username fullName avatar isVerified');

    res.json({ posts: posts.map((p) => withFlags(p, req.user._id)), hasMore: posts.length === limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── User posts ─────────────────────────────────────────────────────────────────
exports.getUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('_id');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id, visibility: { $ne: 'private' } })
      .sort({ createdAt: -1 })
      .populate('author', 'username fullName avatar isVerified');

    res.json({ posts: posts.map((p) => withFlags(p, req.user._id)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Toggle Like ───────────────────────────────────────────────────────────────
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('author', '_id username');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const liked = post.likes.some((id) => id.toString() === userId.toString());

    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
      // Notify post author (not self)
      if (post.author._id.toString() !== userId.toString()) {
        const notif = await Notification.create({
          recipient: post.author._id,
          sender: userId,
          type: 'like',
          post: post._id,
        });
        // Real-time emit
        const io = req.app.get('io');
        io?.to(`user:${post.author._id}`).emit('notification:new', {
          type: 'like',
          from: req.user,
          post: post._id,
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes, isLiked: !liked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Add Comment ───────────────────────────────────────────────────────────────
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.postId).populate('author', '_id');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    const updated = await Post.findById(post._id)
      .populate('comments.user', 'username fullName avatar isVerified');
    const comment = updated.comments[updated.comments.length - 1];

    // Notify
    if (post.author._id.toString() !== req.user._id.toString()) {
      await Notification.create({ recipient: post.author._id, sender: req.user._id, type: 'comment', post: post._id });
      const io = req.app.get('io');
      io?.to(`user:${post.author._id}`).emit('notification:new', { type: 'comment', from: req.user, post: post._id });
    }

    res.json({ comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Toggle Save ───────────────────────────────────────────────────────────────
exports.toggleSave = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const postId = req.params.postId;
    const isSaved = me.savedPosts.some((id) => id.toString() === postId);

    if (isSaved) {
      me.savedPosts = me.savedPosts.filter((id) => id.toString() !== postId);
    } else {
      me.savedPosts.push(postId);
    }
    await me.save();
    res.json({ isSaved: !isSaved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Delete Post ───────────────────────────────────────────────────────────────
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised' });
    }
    await post.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: post._id } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
