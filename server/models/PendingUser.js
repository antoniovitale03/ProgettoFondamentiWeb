const mongoose = require('mongoose');

const pendingUserSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true }, // opzionale, puoi anche salvarla dopo
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, required: true } //scadenza del codice di verifica (60s = 1min)
})

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
module.exports = PendingUser;