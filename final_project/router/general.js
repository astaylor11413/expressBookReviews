const express = require('express');
let books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(isValid(username)){
        res.send("User already exists! Go ahead and login.");
    }else{
        users.push({"username":username,"password":password});
        res.send("The user "+ users[users.length>0?(users.length-1):0].username +" has been added as user #"+users.length);
    }
  }else{
    res.send("Appropriate username or password was not provided.");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve("Promise resolved")
        },2000)});
   myPromise.then((result) => {
        console.log("Status of call: " + result);
        res.send(JSON.stringify(books,null,4));
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //needs to be implemented
    const isbn = req.params.isbn;
    if(isbn){
        if(books[isbn]){
            let myPromise = new Promise((resolve) => {
                setTimeout(() => {
                  resolve("Promise resolved")
                },2000)});
           myPromise.then((result) => {
                console.log("Status of call: " + result);
                res.send(books[isbn]);
            });
        }else{
            res.send("Hmm..We could not find that book. Make sure the ISBN number is correct.");
        }
    }else{
        res.send("ISBN number needed to complete this search.");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    if(author){
        let keysArray = Object.keys(books);
        let filteredBookKeys = keysArray.filter((key)=>books[key].author==author);
        //check if there was a match detected by filter
        if(filteredBookKeys.length>0){
            
            let myPromise = new Promise((resolve) => {
                setTimeout(() => {
                  resolve("Promise resolved")
                },2000)});
           myPromise.then((result) => {
                console.log("Status of call: " + result);
                filteredBookKeys.forEach((key)=>{
                    res.send(books[key]);
                })
            });
        
        }else{
            res.send("No books were found by that author");
        }
    }else{
        res.send("Author names are needed to complete an author search.");
    }

});
    

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    if(title){
        let keysArray = Object.keys(books);
        let filteredBookKeys = keysArray.filter((key)=>books[key].title==title);
        //check if there was a match detected by filter
        if(filteredBookKeys.length>0){
            
            let myPromise = new Promise((resolve) => {
                setTimeout(() => {
                  resolve("Promise resolved")
                },2000)});
           myPromise.then((result) => {
                console.log("Status of call: " + result);
                filteredBookKeys.forEach((key)=>{
                    res.send(books[key]);
                });
            });
        }else{
            res.send("No books were found by that title");
        }
    }else{
        res.send("Titles are needed to complete a title search.");
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(isbn){
    if(books[isbn]){
        const reviewKeys = Object.keys(books[isbn].reviews);
        if(reviewKeys.length>0){
            reviewKeys.forEach((reviewKey)=>{
                let reviewSubmission = books[isbn].reviews[reviewKey];
                res.send( reviewSubmission["Review"]+ " - "+ reviewSubmission["userName"]  );
            })
        }else{
            res.send("That book has no reviews yet. Sign in and be the first!");
        }
    }else{
        res.send("Hmm..We could not find reviews for that book. Make sure the ISBN number is correct.");
    }
  }else{
    res.send("ISBN number needed to complete reviews search.");
  }
});

module.exports.general = public_users;
