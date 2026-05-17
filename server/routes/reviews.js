const express = require('express');
const router = express.Router();

// GET /api/reviews - alle reviews ophalen
router.get('/', async function(req, res) {
  try {
    var Review = require('../models/Review');
    var reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, reviews: reviews });
  } catch (err) {
    console.error('[Reviews] Fout bij ophalen:', err.message);
    return res.json({ success: true, reviews: [] });
  }
});

module.exports = router;
