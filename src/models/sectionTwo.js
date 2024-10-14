const mongoose = require('mongoose');


const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    required: [true, 'Item subtitle is required'],
    trim: true
  }
});

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    required: [true, 'Section subtitle is required'],
    trim: true
  },
  items: {
    type: [ItemSchema],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one item is required'
    }
  }
}, { timestamps: true });

const Section = mongoose.models.Section || mongoose.model('SectionTwo', SectionSchema);

module.exports = Section;