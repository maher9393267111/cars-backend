const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const NavTitlesSchema = new mongoose.Schema({
  items: [ItemSchema],
  fontSize: {
    type: String,
    enum: ['text-sm', 'text-md', 'text-lg', 'text-xl', 'text-2xl'],
    default: 'text-md'
  },
  textColor: {
    type: String,
    default: 'white'
  },
  iconColor: {
    type: String,
    default: 'green'
  }
});

const NavTitles = mongoose.model('NavTitles', NavTitlesSchema);

module.exports = NavTitles;