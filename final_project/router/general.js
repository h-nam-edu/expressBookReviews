const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let output = [];
  for (var isbn in books) {
    if (books[isbn].author === author) {
      output.push({
        "isbn": isbn,
        "author": books[isbn].author,
        "title": books[isbn].title,
        "reviews": books[isbn].reviews
      });
    }
  }
  res.send(output);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let output = [];
  for (var isbn in books) {
    if (books[isbn].title === title) {
      output.push({
        "isbn": isbn,
        "author": books[isbn].author,
        "title": books[isbn].title,
        "reviews": books[isbn].reviews
      });
    }
  }
  res.send(output);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

/* ==========================================================
   AXIOS IMPLEMENTATIONS FOR TASKS 10 - 13
========================================================== */

const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const getBookByIsbnPromise = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
};

const getBookByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const getBookByTitleAsync = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

module.exports.general = public_users;