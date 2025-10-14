const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
    userID: { type: String, ref: "User", required: true },
    name: { type: String, required: true },
    films: [{ type: Number, ref: "Film" }],
})

const List = mongoose.model("List", listSchema);
module.exports = List;