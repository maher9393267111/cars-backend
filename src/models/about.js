const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, 'title is required.'],
    },
    description: {
        type: String,
      required: [true, 'Description is required.'],
    },

    //contect details
    content: {  
        type: String,
          required: [true, 'Content is required.'],
    },




    slug: {
      type: String,
    //  unique: true,
    //  required: [true, 'Slug is required.'],
    },




  },
  {
    timestamps: true,
  }
);

const About = mongoose.models.About || mongoose.model('About', AboutSchema);
module.exports = About;
