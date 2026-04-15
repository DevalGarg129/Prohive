// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, followUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/search', searchUsers);
router.get('/:username', getProfile);
router.put('/profile', updateProfile);
router.post('/follow/:userId', followUser);

module.exports = router;
