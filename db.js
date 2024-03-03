const mongoose = require('mongoose');
const URI = "mongodb+srv://jjtam625:mangos1234@cluster0.qleagug.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    console.log("attempting to connect to the database")
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    console.log("database successfully connected")
}

module.exports = connectDB;