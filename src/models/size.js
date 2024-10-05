const mongoose = require("mongoose");

/* Define the interface for the SubCategory document */
const SizeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    // type: {
    //     type: String,

    //     required: true,
    //   },

    show: {
      type: Boolean,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SizeOption",
    },
  },
  { timestamps: true }
);

const Size = mongoose.models.Size || mongoose.model("Size", SizeSchema);
module.exports = Size;
