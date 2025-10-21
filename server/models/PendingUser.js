const mongoose = require('mongoose');

const pendingUserSchema = mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    hashedPassword: { type: String }, // opzionale, puoi anche salvarla dopo
    verificationCode: { type: String },
    expiresAt: { type: Date } //scadenza del codice di verifica (60s = 1min)
})

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
module.exports = PendingUser;