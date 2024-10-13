// const mongoose = require('mongoose');

// const SectionSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title is required'],
//   },
//   link: {
//     type: String,
//     default: '/cars'
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required'],
//   },
//   show: {
//     type: Boolean,
//     default: true,
//   },
//   logo: {
//     _id: {
//       type: String,
//       required: [true, "Image ID is required"],
//     },
//     url: {
//       type: String,
//       required: [true, "Image URL is required"],
//     },
//     blurDataURL: {
//       type: String,
//     },
//   },
//   direction: {
//     type: String,
//     enum: ['left', 'right'],
//     default: 'left'
//   },
//   slug: {
//     type: String,
//   },
// }, {
//   timestamps: true,
// });

// const MultiSectionsSchema = new mongoose.Schema({
//   sections: {
//     type: [SectionSchema],
//     required: [true, 'At least one section is required'],
//     validate: {
//       validator: function(sections) {
//         return sections.length > 0;
//       },
//       message: 'There must be at least one section'
//     }
//   },
//   globalSlug: {
//     type: String,
//     unique: true,
//    // required: [true, 'Global slug is required'],
//   }
// }, {
//   timestamps: true,
// });

// // Add a pre-save hook to generate slugs for each section if not provided
// MultiSectionsSchema.pre('save', function(next) {
//   if (this.isModified('sections')) {
//     this.sections.forEach((section, index) => {
//       if (!section.slug) {
//         section.slug = `${this.globalSlug}-section-${index + 1}`;
//       }
//     });
//   }
//   next();
// });

// const SectionOne = mongoose.model('Sections', MultiSectionsSchema);

// module.exports = SectionOne;










const mongoose = require('mongoose');

const SectionOneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
    default:'/cars'
  },


  description: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: true, // Default value is true
  },

  logo: {
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


  direction: {
    type: String,
    default:'left'
  },

  


  slug: {
    type: String,
    unique: true,
   // required: [true, 'Slug is required.'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const SectionOne = mongoose.model('SectionOne', SectionOneSchema);

module.exports = SectionOne;