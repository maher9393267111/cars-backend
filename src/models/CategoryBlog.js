const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
//     cover: {
//       _id: {
//         type: String,
//         required: [true, 'image-id-required-error'],
//       },
//       url: {
//         type: String,
//         required: [true, 'image-url-required-error'],
//       },
//       blurDataURL: {
//         type: String,
//    //     required: [true, 'image-blur-data-url-required-error'],
//       },
//     },
    name: {
      type: String,
      required: [true, 'Name is required.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
 
    slug: {
      type: String,
      unique: true,
      required: true,
    },


    show: {
      type: Boolean,
    },

  },
  {
    timestamps: true,
  }
);

const BlogCategory =
  mongoose.models.BlogCategory || mongoose.model('BlogCategory', CategorySchema);
module.exports = BlogCategory;
