const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  link: {
    type: String,
    default: '/cars'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  show: {
    type: Boolean,
    default: true,
  },
  logo: {
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
  slug: {
    type: String,
  },

  order: {
    type: String,
  },

  
}, {
  timestamps: true,
});

const MultiSectionsSchema = new mongoose.Schema({
  sections: {
    type: [SectionSchema],
    required: [true, 'At least one section is required'],
    validate: {
      validator: function(sections) {
        return sections.length > 0;
      },
      message: 'There must be at least one section'
    }
  },
  globalSlug: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
});

// Add a pre-save hook to generate slugs for each section if not provided
MultiSectionsSchema.pre('save', function(next) {
    if (this.isModified('sections')) {
      this.sections.forEach((section, index) => {
        if (!section.slug) {
          section.slug = `${this.globalSlug}-section-${index + 1}`;
        }
        section.order = index; // Ensure the order is always set correctly
      });
    }
    next();
  });


const SectionThree = mongoose.model('SectionThree', MultiSectionsSchema);

module.exports = SectionThree;