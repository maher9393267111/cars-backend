


const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
        required: [true, 'image-blur-data-url-required-error'],
      },
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
        required: [true, 'image-blur-data-url-required-error'],
      },
    },
    title: {
      type: String,
      required: [true, 'Name is required.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    metaTitle: {
      type: String,
      required: [true, 'Meta title is required.'],
      maxlength: [100, 'Meta title cannot exceed 100 characters.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      maxlength: [500, 'Description cannot exceed 500 characters.'],
    },
    metaDescription: {
      type: String,
      required: [true, 'Meta description is required.'],
      maxlength: [200, 'Meta description cannot exceed 200 characters.'],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    approved: {
      type: Boolean,
      required: true,
      default: false,
    },
    approvedAt: {
      type: Date,
    },

    website: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        'approved',
        'pending',
        'in review',
        'action required',
        'blocked',
        'rejected',
      ],
      required: true,
    },
    message: {
      type: String,
    },

    type: {
      type: String,
      required: true,
      default:"combi"
    },

    plantype:{type:String ,required:false ,  default:"combi"},
    plan: { type: String, required: false}, // e.g., "Basic", "Premium", etc.
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    isActive: { type: Boolean, default: false }, // Indicates if the subscription is currently active
    trial: {
        isTrial: { type: Boolean, default: false }, // Indicates if the subscription is in a trial period
        trialStartDate: { type: Date }, // Start date of the trial
        trialEndDate: { type: Date }, // End date of the trial (30 days from trialStartDate)
    },



    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      },
    ],


    boilers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Boiler',
      },
    ],


    paymentInfo: {
      holderName: {
        type: String,
        required: true,
      },
      holderEmail: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      AccountNo: {
        type: Number,
        required: true,
      },
    },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      streetAddress: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);
module.exports = Shop;

