const db = require("./database")
const mongoose = require("mongoose")

const BookSchema = mongoose.Schema({
    title: String,
    isbn: String,
    author: String,
    addBy: String
})

module.exports = mongoose.model("books", BookSchema)