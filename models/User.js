const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    firstName: String,
    lastName: String,
    authEmail: String,
    prefEmail: String,
    phoneNumber: String,
    zipcode: Number,
})

module.exports = mongoose.model("User", UserSchema);