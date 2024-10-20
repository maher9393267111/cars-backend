// models/Review.js
// commenr model 
// models/Review.js

// This file defines the schema for the Review model in MongoDB using Mongoose.

// Import the mongoose library
// const mongoose = require('mongoose');

// Define the Review schema
// const ReviewSchema = new mongoose.Schema({
//     // Reference to the User who created the review
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     // Rating given in the review (numeric value)
//     rating: {
//         type: Number,
//         required: true
//     },
//     // Text content of the review
//     review: {
//         type: String,
//         required: true
//     },
//     // Designation of the reviewer
//     designation: {
//         type: String,
//         required: true
//     },
//     // Timestamp for when the review was created
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// Create the Review model if it doesn't already exist
// const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// Export the Review model
// module.exports = Review;



// models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    imageType: {
        type: String,
        enum: ['default', 'firstLetter', 'upload'],
        required: true
    },
    image: {
        url: {
            type: String,
            default: null
        },
        _id: {
            type: String,
            default: null
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if the model is already defined
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

module.exports = Review;