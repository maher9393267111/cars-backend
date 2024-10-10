const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const featureSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    unique: true,
  },
  items: [
    {
      title: {
        type: String,
       required: true,
      }
   
    },

 

  ],

  show: {
    type: Boolean,
    default: true, // Default value is true
  },
}
,
{
    timestamps: true,
  }


);

const Feature =
  mongoose.models.Feature || mongoose.model('Feature', featureSchema);
module.exports = Feature;