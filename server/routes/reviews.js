const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /api/reviews - alle reviews ophalen
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('[Reviews] Fout bij ophalen:', err.message);
    res.json({ success: true, reviews: [] });
  }
});

module.exports = router;
