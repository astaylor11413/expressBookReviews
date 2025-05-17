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

//add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                const isbn = req.params.isbn;
                if(isbn){
                    if(books[isbn]){
                        if(req.body.review){
                            
                            books[isbn].reviews[Object.keys(books[isbn].reviews).length+1]={
                                "userName":req.user,
                                "Review": req.body.review,
                            };
                        }else{
                            res.send("No review was submitted.");
                        }
                    }else{
                        res.send("Hmm..We could not find that book. Make sure the ISBN number is correct.");
                    }
                }else{
                    res.send("ISBN number needed to complete reviews search.");
                }
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

//modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  /*
    const email = req.params.email;
    let friend = friends[email];
    if(friend){
        let DOB = req.body.DOB;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        if(DOB){
            friend["DOB"] = DOB;
        }
        if(firstName){
            friend["firstName"] = firstName;
        }

        if(lastName){
            friends["lastName"]= lastName;
        }

        friends[email] = friend;
        res.send(`Friend with the email ${email} updated.`);
    }else{
        res.send("Unable to find friend!");
    }
  */
   const isbn = req.params.isbn;
   if(isbn){
        if(books[isbn]){
            let reviewKeys = Object.keys(books[isbn].reviews);
            if(reviewKeys.length>0){
                reviewKeys.forEach((key)=>{
                    res.send(books[isbn].reviews[key]);
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

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
 /*
    const email = req.params.email;
    if(email){
        if(friends[email]){
            delete friends[email];
        }
        
    }
 */
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
