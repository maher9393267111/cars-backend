const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema(
  {
    logo: {
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

    logomobile: {
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


    title: {
      type: String,
      required: [true, 'title is required.'],
    },
    description: {
        type: String,
      required: [true, 'Description is required.'],
    },




    slug: {
      type: String,
    //  unique: true,
    //  required: [true, 'Slug is required.'],
    },

    // add banner bg color
    bgColor: {
      type: String,
    //  required: [true, 'Banner bg color is required.'],
    default: '#FFFFFF',
    },

    //text color
    textColor: {
      type: String,
    //  required: [true, 'Banner text color is required.'],
    default: '#000000',
    },


  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
module.exports = Banner
