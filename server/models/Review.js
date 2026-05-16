const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  stars: { type: Number, required: true, min: 1, max: 5 },
  dienst: { type: String, trim: true, maxlength: 100, default: '' },
  message: { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
