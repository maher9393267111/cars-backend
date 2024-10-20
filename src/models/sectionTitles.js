const mongoose = require('mongoose');

const TitlesSchema = new mongoose.Schema({

  brandtitle: {
    type: String,
    required: [true, 'BrandTitle is required.'],
  },
  brandsubtitle: {
    type: String,
    required: [true, 'BrandSubtitle is required.'],
  },


  servicestitle: {
    type: String,
    required: [true, 'ServicesTitle is required.'],
  },
  servicessubtitle: {
    type: String,
    required: [true, 'ServicesSubtitle is required.'],
  },
  carTitle: {
    type: String,
    required: [true, 'CarTitle is required.'],
  },
  carSubtitle: {
    type: String,
    required: [true, 'CarSubtitle is required.'],
  },

  //add faqs title and subtitle
  faqsTitle: {
    type: String,
    required: [true, 'FaqTitle is required.'],
  },
  faqsSubtitle: {
    type: String,
    required: [true, 'FaqSubtitle is required.'],
  },

  sectionOneTitle: {
    type: String,
   // required: [true, 'SectionOneTitle is required.'],
  },
  sectionOneSubtitle: {
    type: String,
 //   required: [true, 'SectionOneSubtitle is required.'],
  },
  
  //review title and subtitle
  reviewTitle: {
    type: String,
    required: [true, 'ReviewTitle is required.'],
    default: 'What Our Clients Say',
  },
  reviewSubtitle: {
    type: String,
    required: [true, 'ReviewSubtitle is required.'],
    default: 'We are proud of our work and the feedback we receive from our clients.',
  },

}, {
  timestamps: true,
});

const SiteSection = mongoose.models.SiteSection || mongoose.model('Titles', TitlesSchema);

module.exports = SiteSection;