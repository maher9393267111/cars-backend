const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema(
  {
    logo: {
      _id: {
        type: String,
     //   required: [true, 'image-id-required-error'],
      },
      url: {
        type: String,
    //    required: [true, 'image-url-required-error'],
      },
      blurDataURL: {
        type: String,
      //  required: [true, 'image-blur-data-url-required-error'],
      },
    },
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
   
    slug: {
      type: String,
      unique: true,
      required: [true, 'Slug is required.'],
    },


    show: {
      type: Boolean,
    },

    brand: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
      },

  },
  {
    timestamps: true,
  }
);

const Model = mongoose.models.Model || mongoose.model('Model', ModelSchema);
module.exports = Model;
