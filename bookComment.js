const db = require("./database")
const mongoose = require("mongoose")

const BookReviewSchema = mongoose.Schema({
    name: String,
    email: String,
    review: String,
    bookid: String
})

module.exports = mongoose.model("booksreview", BookReviewSchema)