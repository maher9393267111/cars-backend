const mongoose = require('mongoose');

const SectionOneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
    default:'/cars'
  },


  description: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: true, // Default value is true
  },

  logo: {
    _id: {
      type: String,
      required: [true, "image-id-required-error"],
    },
    url: {
      type: String,
      required: [true, "image-url-required-error"],
    },
    blurDataURL: {
      type: String,
      //     required: [true, 'image-blur-data-url-required-error'],
    },
  },


  direction: {
    type: String,
    default:'left'
  },

  


  slug: {
    type: String,
    unique: true,
   // required: [true, 'Slug is required.'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const SectionOne = mongoose.model('SectionOne', SectionOneSchema);

module.exports = SectionOne;