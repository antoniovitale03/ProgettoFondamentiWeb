const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    films: [{type: String, ref:"Film"}],
})

const List = mongoose.model("List", listSchema);
module.exports = List;