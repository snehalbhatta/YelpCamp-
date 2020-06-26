//implementing express router
var express= require("express");
var router= express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var User= require("../models/user");
var passport     = require("passport");
var LocalStrategy= require("passport-local");



//Home route 
router.get("/",function(req,res){
	
	res.render("landing.ejs");
	
})





//===============
//AUTH ROUTES
//===============

//show register form

router.get("/register", function(req, res){
   res.render("register.ejs"); 
});

//handling user sign up
router.post("/register", function(req, res){
	var newUser=new User({username: req.body.username});
	
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            
			req.flash("error", err.message);
  			return res.redirect("/register");
        }
		
		
        passport.authenticate("local")(req, res, function(){
			req.flash("success"," Welcome to YelpCamp:"+user.username);
			
           res.redirect("/campgrounds");
        });
    });
});


// LOGIN ROUTES

//render login form
router.get("/login", function(req, res){
	
   res.render("login.ejs"); 
});

//login logic
//middleware
router.post("/login", passport.authenticate("local", {
	
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});


//logout route
router.get("/logout", function(req, res){
    req.logout();
	req.flash("success","Successfully logged you out!");
    res.redirect("/campgrounds");
});




module.exports= router;