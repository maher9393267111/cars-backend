// models/SiteInfo.js
const mongoose = require('mongoose');

const SiteInfoSchema = new mongoose.Schema({
  whatsapp: {
    type: String,
   // required: true,
    //trim: true,
  },
  twitter: {
    type: String,
  //  required: true,
  //  trim: true,
  },
  youtube: {
    type: String,
   // required: true,
   // trim: true,
  },
  telegram: {
    type: String,
  //  required: true,
   // trim: true,
  },
  linkedin: {
    type: String,
  //  required: true,
   // trim: true,
  },

  facebook: {
    type: String},

  email: {
    type: String,
 //   required: true,
  //  trim: true,
  },
  address: {
    type: String,
   // required: true,
   // trim: true,
  },
  phone: {
    type: String,
  //  required: true,
   // trim: true,
  },


}, {
  timestamps: true,
});

module.exports = mongoose.model('SiteInfo', SiteInfoSchema);