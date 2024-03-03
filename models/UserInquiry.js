const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserInquirySchema = new Schema ({
    foodBankEmail: String,
    firstName: String,
    lastName: String,
    userEmail: String,
    userPhoneNumber: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model("UserInquiry", UserInquirySchema);