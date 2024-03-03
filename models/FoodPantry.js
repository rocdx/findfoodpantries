const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodPantrySchema = new Schema ({
    name: String,
    description: String,
    imageURL: String,
    address: String,
    phoneNumber: String,
    email: String,
    externalURL: String,
    city: String,
    county: String,
    state: String,
})

module.exports = mongoose.model("FoodPantry", FoodPantrySchema);