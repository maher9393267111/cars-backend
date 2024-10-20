const mongoose = require('mongoose');

const SiteReviewSchema = new mongoose.Schema(
  {
    cover: {
      _id: {
        type: String,
      //  required: [true, 'image-id-required-error'],
      },
      url: {
        type: String,
      //  required: [true, 'image-url-required-error'],
      },
      blurDataURL: {
        type: String,
       // required: [true, 'image-blur-data-url-required-error'],
      },
    },

    //also add imagtype  so ican select defaul or upload or first word of the name of customer
    imagetype: {
      type: String,
      default: 'upload',
    },


    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    jobtitle: {
        type: String,
        required: [true, 'Job title is required.'],
      },
      


      description: {
        type: String,
        required: [true, 'Description is required.'],
      },

      rating: {
        type: String,
        default:1,
        required: [true, 'Description is required.'],
      },

      show: {
        type: Boolean,
      },


    slug: {
      type: String,
      unique: true,
      required: [true, 'Slug is required.'],
    },
  
  },
  {
    timestamps: true,
  }
);

const SiteReview = mongoose.models.SiteReview || mongoose.model('SiteReview', SiteReviewSchema);
module.exports = SiteReview;
