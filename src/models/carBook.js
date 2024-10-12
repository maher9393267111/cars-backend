const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CarBookSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  car: {
    type: mongoose.Types.ObjectId,
    ref: "Car",
  },
  

  note: {
    type: String,
  //  required: true,
  },

  slug: {
    type: String,
    //unique: true,
  },



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

const CarBook =
  mongoose.models.CarBookSchema || mongoose.model('CarBook', CarBookSchema);
module.exports = CarBook;