// models/offer.js
const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
  },
  link: {
    type: String,
    default: '/offers'
  },
  image: {
    _id: {
      type: String,
      required: [true, "Image ID is required"],
    },
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    blurDataURL: {
      type: String,
    },
  },
  show: {
    type: Boolean,
    default: true,
  },
  slug: {
    type: String,
  },

titleColor: {
  type: String,
  default: '#000000', //black
},  
subtitleColor: {
  type: String,
  default: '#637381',  // gray  that set in form
},
buttonColor: {
  type: String,
  default: '#FFFFFF', //white
},

buttonBgColor: {
  type: String,
  default: '#EE1E50', //set red text-main bg-white 
},
buttonText: {
  type: String,
  default: '#FFFFFF', //white
},
}, {
  timestamps: true,
});

const MultiOffersSchema = new mongoose.Schema({
  offers: {
    type: [OfferSchema],
    required: [true, 'At least one offer is required'],
    validate: {
      validator: function(offers) {
        return offers.length > 0;
      },
      message: 'There must be at least one offer'
    }
  },


  globalSlug: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
});

// Add a pre-save hook to generate slugs for each offer if not provided
MultiOffersSchema.pre('save', function(next) {
  if (this.isModified('offers')) {
    this.offers.forEach((offer, index) => {
      if (!offer.slug) {
        offer.slug = `${this.globalSlug}-offer-${index + 1}`;
      }
    });
  }
  next();
});

const Offer = mongoose.model('Offers', MultiOffersSchema);

module.exports = Offer;