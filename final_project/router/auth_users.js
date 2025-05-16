const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
//check if the username is valid
    let validNames = users.filter((user)=>{
        username===user.username;
    });
    if(validNames.length>0){
        return true;
    }else{
        return false;
    }
}

const authenticatedUser = (username, password) => {
    // Return true if any valid user is found, otherwise false
    let validUsers = users.filter((user) => {
        isValid(username) && (user.password === password);
    });    
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if(authenticatedUser(username,password)){
        //JWT token
         let accessToken = jwt.sign({
             data: password
         }, 'access', { expiresIn: 60 * 60 });
 
         // Store token and username in session
         req.session.authorization = {
             accessToken, username
         }
         return res.status(200).send("User successfully logged in");
     }else{
         res.send("User has not been authenticated.");
     }
   }else{
    return res.status(404).json({ message: "Error logging in" });
   }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
