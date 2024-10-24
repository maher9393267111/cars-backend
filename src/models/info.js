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


  
  cover: {
    _id: {
      type: String,
      required: [true, 'image-id-required-error'],
    },
    url: {
      type: String,
      required: [true, 'image-url-required-error'],
    },
    blurDataURL: {
      type: String,
    //  required: [true, 'image-blur-data-url-required-error'],
    },
  },


  footerCover: {
    _id: {
      type: String,
      required: [true, 'image-id-required-error'],
    },
    url: {
      type: String,
      required: [true, 'image-url-required-error'],
    },
    blurDataURL: {
      type: String,
    //  required: [true, 'image-blur-data-url-required-error'],
    },
  },


}, {
  timestamps: true,
});

module.exports = mongoose.model('SiteInfo', SiteInfoSchema);