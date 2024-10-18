const mongoose = require('mongoose');

const WorkHoursSchema = new mongoose.Schema(
  {
    monday: {
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    },
    tuesday: {
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    },
    wednesday: {
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    },
    thursday: {
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    },
    friday: {
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    },
    saturday: {
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    },
    sunday: {
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
  }
);

const WorkHours = mongoose.models.WorkHours || mongoose.model('WorkHours', WorkHoursSchema);
module.exports = WorkHours;