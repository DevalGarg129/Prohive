// backend/src/routes/stories.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

// Returns empty groups for now — easy to expand with a Story model later
router.get('/', (req, res) => {
  res.json({ storyGroups: [] });
});

module.exports = router;
