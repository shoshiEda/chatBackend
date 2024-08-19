const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName:String,
    passwordHash:String,
    conversations:[{}],
    isLoggedIn:Boolean
})

module.exports = mongoose.model("users", userSchema)