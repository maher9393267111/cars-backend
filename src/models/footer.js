const mongoose = require('mongoose');

// Define the schema for footer items
const FooterItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
  },
});

// Define the main Footer schema
const FooterSchema = new mongoose.Schema({


title: {
  type: String,
  required: [true, 'Title is required'],
},
description: {
  type: String,
  required: [true, 'description is required'],
},

  headingOne: {
    type: String,
    required: [true, 'Heading One is required'],
  },
  headingOneItems: [FooterItemSchema],
  headingTwo: {
    type: String,
    required: [true, 'Heading Two is required'],
  },
  headingTwoItems: [FooterItemSchema],






}, {
  timestamps: true,
});

//same about structure


const Footer = mongoose.models.Footer || mongoose.model('Footer', FooterSchema);
module.exports = Footer;


