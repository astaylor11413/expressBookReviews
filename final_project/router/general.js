const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    res.send("Appropriate username or password was not provided.");
  }else{
    if(users.length>0){
        //Check if user already exists in system
        if(isValid(username)){
            res.send("User already exists!");
        }else{
            users.push({"username":username,"password":password});
            res.send("The user "+ users[(users.length)-1].username +" has been added");
        }
    }else{
        //adding first user
        users.push({"username":username,"password":password});
        res.send("The user "+ users[(users.length)-1].username +" has been added");
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //needs to be implemented
    
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let keysArray = Object.keys(books);
    let filteredBooks=[];
    for(var i=0; i<keysArray.length;i++){
        let book = books[(keysArray[i])];
        if(book["author"]==author){
            filteredBooks.push(book);
        }
    } 
    if(filteredBooks.length>0){
        res.send(filteredBooks);
    }else{
        res.send("No books were found by that author");
    }

});
    

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let keysArray = Object.keys(books);
    let filteredBooks=[];
    for(var i=0; i<keysArray.length;i++){
        let book = books[(keysArray[i])];
        if(book["title"]==title){
            filteredBooks.push(book);
        }
    } 
    if(filteredBooks.length>0){
        res.send(filteredBooks);
    }else{
        res.send("No books were found by that title");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
