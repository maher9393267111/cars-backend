const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  show: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
   // required: [true, 'Icon is required'],
  },
  slug: {
    type: String,
  },
}, {
  timestamps: true,
});

const MultiServicesSchema = new mongoose.Schema({
  services: {
    type: [ServiceSchema],
    required: [true, 'At least one service is required'],
    validate: {
      validator: function(services) {
        return services.length > 0;
      },
      message: 'There must be at least one service'
    }
  },
  globalSlug: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
});

// Add a pre-save hook to generate slugs for each service if not provided
MultiServicesSchema.pre('save', function(next) {
  if (this.isModified('services')) {
    this.services.forEach((service, index) => {
      if (!service.slug) {
        service.slug = `${this.globalSlug}-service-${index + 1}`;
      }
    });
  }
  next();
});

const Services = mongoose.model('Services', MultiServicesSchema);

module.exports = Services;