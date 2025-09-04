const mongoose = require("mongoose");

//proprietà utili da mostrare nella reviewCard
const reviewSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: { type: String, required: true },
    release_year: { type: Number, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, default: null },
    review_date: { type: String, required: true },
    })

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;