const express = require("express");
const app = express();
require('dotenv').config()
const db = require("./database")
const BookSchema = require("./bookSchema");
const BookReviewSchema = require("./bookComment")
const UserSchema = require("./userSchema")
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const axios = require("axios")


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// test route
app.get("/", (req, res) => {
    res.send({ message: "Server is worling" })
})

// get all books 
// (TASK-1)
app.get("/books", async (req, res) => {
    const booksList = await BookSchema.find({})
    res.json({ books: booksList })
})

// search books by ISBN number
// (TASK-2)
app.get("/book/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const booksList = await BookSchema.find({ isbn: isbn })
    res.json({ "searchType": "ISBN", "totalRecords": booksList.length, books: booksList })
})

// search books by AUTHOR name
// (TASK-3)
app.get("/book/author/:author", async (req, res) => {
    const author = req.params.author;
    const booksList = await BookSchema.find({ author: author })
    res.json({ "searchType": "AUTHOR", "totalRecords": booksList.length, books: booksList })
})

// search books by TITLE name
// (TASK-4)
app.get("/book/title/:title", async (req, res) => {
    const title = req.params.title;
    const booksList = await BookSchema.find({ title: title })
    res.json({ "searchType": "AUTHOR", "totalRecords": booksList.length, books: booksList })
})

// get book REVIEW
// (TASK-5)
app.get("/book/review/:bookId", async (req, res) => {
    const bookId = req.params.bookId;
    const booksList = await BookReviewSchema.find({ bookid: bookId })
    res.json({ "searchType": "Book Review", "totalRecords": booksList.length, books: booksList })
})

// register new user
// (TASK-6)
app.post("/user/create", async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const check = await UserSchema.find({ email: req.body.email })

    if (check.length == 0) {
        const result = await new UserSchema(user);
        await result.save();
        res.json({ message: "Account Created Successfully" })
    }
    else {
        res.json({ message: "Account already register with this email" })
    }
})

// login user
// (TASK-7)
app.post("/user/login", async (req, res) => {
    const check = await UserSchema.find({ email: req.body.email })

    if (check.length == 1) {
        if (check[0].password === req.body.password) {
            const userData = {
                name: check[0].name,
                email: req.body.email
            }
            const jwt_token = jwt.sign(req.body.email, process.env.JWT_SECRET)
            console.log(jwt.decode(jwt_token))
            res.json({ message: "user Loggedin Successfully", token: jwt_token, user: userData })
        }
        else {
            res.json({ message: "Incorrect Password" })
        }
    }
    else {
        res.json({ message: "No account is register with this email" })
    }
})

// add or modify book review
// (TASK-8)
app.post("/book/review/", async (req, res) => {
    // const bookId = req.params.bookId
    const bookid = req.body.bookid;
    const reviewData = {
        name: req.body.name,
        email: req.body.email,
        review: req.body.review,
        bookid: req.body.bookid
    }

    try {
        const checkReview = await BookReviewSchema.find({ bookid: bookid });
        if (checkReview.length == 0) {
            const createReview = await new BookReviewSchema(reviewData);
            await createReview.save();
            return res.json({ message: "Review Addedd Successfully" })
        }
        await BookReviewSchema.updateOne({ bookid: bookid, $set: { review: req.body.review } })
        return res.json({ message: "Review Updated Successfully" })

    }
    catch (e) {
        return res.json({ message: "Server Error" })
    }
})

// delete book review
// (TASK-9)
app.delete("/book/delete/:bookId/user/:userId", async (req, res) => {
    const bookId = req.params.bookId
    const userId = req.params.userId
    try {
        const checkBook = await BookSchema.find({ _id: bookId });
        if (checkBook[0].addBy == userId) {
            await BookSchema.find({ _id: bookId }).deleteOne();
            return res.json({ message: "Book deleted successfully" })
        }
        return res.json({ message: "You don't have permission to delete this book" })
    }
    catch (e) {
        return res.json({ message: "Book Not Found" })
    }
})

// get all booklist using axios
// (TASK-10)
app.get("/booksListAxios", async (req, res) => {
    await axios.get("http://localhost:5000/books")
        .then(response => {
            res.json({ bookList: response.data });
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

// search books by isbn number using axios
// (TASK-11)
app.get("/books/axios/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    await axios.get("http://localhost:5000/book/isbn/" + isbn)
        .then(response => {
            res.json({ bookList: response.data });
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

// search books by author number using axios
// (TASK-12)
app.get("/books/axios/author/:author", async (req, res) => {
    const author = req.params.author;
    await axios.get("http://localhost:5000/book/author/" + author)
        .then(response => {
            res.json({ bookList: response.data });
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

// search books by author number using axios
// (TASK-13)
app.get("/books/axios/title/:title", async (req, res) => {
    const title = req.params.title;
    await axios.get("http://localhost:5000/book/title/" + title)
        .then(response => {
            res.json({ bookList: response.data });
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

// start server
app.listen(process.env.PORT, (err) => {
    if (!err) {
        console.log(`Server is running on port ${process.env.PORT}`);
    }
})