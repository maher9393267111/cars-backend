const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: true, // Default value is true
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;