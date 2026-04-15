// backend/src/routes/posts.js
const express = require('express');
const router = express.Router();
const {
  createPost, getFeed, getExplore, getUserPosts,
  toggleLike, addComment, toggleSave, deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/feed', getFeed);
router.get('/explore', getExplore);
router.get('/user/:username', getUserPosts);
router.post('/', createPost);
router.post('/:postId/like', toggleLike);
router.post('/:postId/comments', addComment);
router.post('/:postId/save', toggleSave);
router.delete('/:postId', deletePost);

module.exports = router;
