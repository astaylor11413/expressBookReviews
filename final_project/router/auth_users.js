const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
//check if the username is valid
    let validNames = users.filter((user)=>{
        username==user.username;
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
        isValid(username) && (user.password == password);
    });    
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}
const authCheck = (req) => {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        try {
            const decodedToken = jwt.verify(token, "access");
            if(decodedToken!=null){
                
                return req.session.authorization['username'];
            }
        } catch (ex) { 
            return res.status(403).json({ message: "There was an error authenticating the current user. Please log in again." });
        }
    } else {
        return res.status(403).json({ message: "User not logged in" });
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
    let user = authCheck(req);
    if(user){
        
        const isbn = req.params.isbn;
                if(isbn){
                    if(books[isbn]){
                        if(req.body.Review){
                            
                            books[isbn].reviews[Object.keys(books[isbn].reviews).length+1]={
                                "userName":user,
                                "Review": req.body.Review,
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
    }
});

//modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let user = authCheck(req); 
    if(user){
        
        const isbn = req.params.isbn;
        if(isbn){
            if(books[isbn]){
                let reviewKeys = Object.keys(books[isbn].reviews);
                if(reviewKeys.length>0){
                    let filteredKey = reviewKeys.filter((key)=>(
                            books[isbn].reviews[key].userName==user
                        )
                    )
                    if(filteredKey){
                        let filteredBookReview = books[isbn].reviews[filteredKey];
                        filteredBookReview["Review"] = req.body.Review;
                        books[isbn].reviews[filteredKey] = filteredBookReview;
                    }else{
                        res.send("You haven't made any reviews to update on this book yet. Add one today!");
                    }
                }else{
                    res.send("That book has no reviews yet. Be the first!");
                }
            }else{
                res.send("Hmm..We could not find reviews for that book. Make sure the ISBN number is correct.");
            }
        }else{
            res.send("ISBN number needed to complete reviews search.");
        }
    }
   
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    let user = authCheck(req); 
    if(user){
        const isbn = req.params.isbn;
        if(isbn){
            if(books[isbn]){
                let reviewKeys = Object.keys(books[isbn].reviews);
                if(reviewKeys.length>0){
                    //find if there is a review the current user made
                    let filteredKey = reviewKeys.filter((key)=>(
                            books[isbn].reviews[key].userName==user
                        )
                    )
                    if(filteredKey.length>0){
                        delete books[isbn].reviews[filteredKey[0]];
                    }else{
                        res.send("You haven't made any reviews to delete on this book.");
                    }
                }else{
                    res.send("That book has no reviews yet. Be the first!");
                }
            }else{
                res.send("Hmm..We could not find reviews for that book. Make sure the ISBN number is correct.");
            }
        }else{
            res.send("ISBN number needed to complete reviews search.");
        }
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
