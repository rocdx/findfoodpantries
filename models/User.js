const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    firstName: String,
    lastName: String,
    authEmail: String,
    prefEmail: String,
    phoneNumber: String,
})

module.exports = mongoose.model("User", UserSchema);