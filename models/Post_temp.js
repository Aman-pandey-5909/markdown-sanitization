const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    post: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema);