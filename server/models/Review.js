const mongoose = require("mongoose");


const reviewSchema = mongoose.Schema({
    film: { type: Number, ref: "Film", required: true},
    review: { type: String, required: true },
    rating: { type: Number, required: true, default: null },
    review_date: { type: String, required: true },
    })

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;