const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
    },
   

    doors: {
      type: Number,
      default: 1,
    },

    seats: {
      type: Number,
      default: 1,
    },
    speed: {
      type: Number,
      default: 1,
    },

    // automatic or manual
    type: {
      type: String,
      default: "manual",
    },
    // fuel type
    fueltype: {
      type: String,
      default: "gasoline",
    },
    // transmission type
    transmissionType: {
      type: String,
      default: "automatic",
    },
    // engine capacity
    engineCapacity: {
      type: String,
      default: "1.6L",
    },
    // year of manufacture

    bodytype: {
      type: String,
    },

    roadtax: {
      type: Number,
      default: 0,
    },
    enginesize: {
      type: String,
    },

    wltp: {
      type: String,
    },

    mbg: {
      type: String,
    },

    year: {
      type: String,
    },

    ulez: {
      type: String,
    },

    wheelbase: {
      type: String,
    },

    features:[Object],

        // New fields for features
        // standardFeatures: {
        //   secondRemoteKeyFob: { type: Boolean, default: false },
        //   secondRowPrivacyGlass: { type: Boolean, default: false },
        //   secondRowTripleWideSeat: { type: Boolean, default: false },
        //   autoHeadlamps: { type: Boolean, default: false },
        //   bodyColourBumper: { type: Boolean, default: false },
        //   completeRearTrimBoard: { type: Boolean, default: false },
        // },
        
        // extraFeatures: {
        //   secondRemoteKeyFob: { type: Boolean, default: false },
        //   secondRowPrivacyGlass: { type: Boolean, default: false },
        // },

    isFeatured: {
      type: Boolean,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    model: {
      type: mongoose.Types.ObjectId,
      ref: "Model",
    },

    likes: {
      type: Number,
    },
    description: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "please provide a category id"],
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      // required: [true, 'please provide a sub category id'],
    },

    tags: [String],

    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    priceSale: {
      type: Number,
      //  required: [true, 'Sale price is required.'],
    },
    oldPriceSale: {
      type: Number,
    },
    available: {
      type: Number,
      //    required: [true, 'Available quantity is required.'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ProductReview",
      },
    ],

    images: [
      {
        url: {
          type: String,
          required: [true],
        },
        _id: {
          type: String,
          required: [true],
        },
        blurDataURL: {
          type: String,
          //  required: [true, 'image-blur-data-url-required-error'],
        },
      },
    ],

    cover: {
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

    show: {
      type: Boolean,
    },

    // ishome is boolean to show this cars true in home page
    ishome: {
      type: Boolean,
      default: false,
    },

    isavaliable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
    
    },

    

    // colors: [String],
    // sizes: [String],
  },
  { timestamps: true, strict: true }
);

const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);
module.exports = Car;
