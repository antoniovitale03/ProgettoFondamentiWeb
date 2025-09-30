const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    senderID: { type: String, ref: 'User', required: true },
    receiverID: { type: String, ref:'User', required: true },
    status: { type: String, required: true }, // "pending" | "accepted" | "declined"
})

const FriendRequest = mongoose.Model("FriendRequest", friendRequestSchema);

module.exports = FriendRequest;