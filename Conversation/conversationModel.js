const mongoose = require("mongoose")

const conversationsSchema = new mongoose.Schema({
    type:String,
    name:String,
    msgs:[{username:String,msg:String}],
    usersInclude:[String],
    blocked:[String],
    creator:String
})

module.exports = mongoose.model("conversations", conversationsSchema)