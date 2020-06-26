//implementing express router
var express= require("express");
var router= express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var User= require("../models/user");
var middleware=require("../middleware");


//INDEX ROUTE --- DISPLAYS ALL THE DATA
router.get("/campgrounds",function(req,res){
	

	//Get all capmgrounds from the database
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
		
			res.render("campgrounds/index.ejs",{campgrounds:allCampgrounds, currentUser:req.user});
			
		}
	})
	
	
	
})

//CREATE ROUTE -- WHERE THE ACTUAL CREATION TAKES PLACE AND WHERE THE NEW FORM SENDS THE DATA TO
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	
	//get data from the form and add the campgrounds array
	//redirect back to campgrounds post
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var campground={name :name,image:image,description:desc,author:author,price:price };
	
	//Create a new campground and save to db
	Campground.create(campground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to the campgrounds page
			res.redirect("/campgrounds");
		}
	});
	
	
})

//NEW ROUTE--SHOW THE FORM TO CREATE A NEW CAMPGROUND
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	
	
	res.render("campgrounds/new.ejs");
	
})


//SHOW ROUTE -- SHOWS MORE INFOR ABOUT A SPECIFIC CAMPGROUND
router.get("/campgrounds/:id",function(req,res){
	//find the campground with the provided provided
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err)
		}else{
			//render the show template with that campground
			res.render("campgrounds/show.ejs",{campground: foundCampground});
		}
	});
	

	
	
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	//is the user logged in?
	
		//does the user own the campground
		//otherwise redirect
	//if the user is not logged in redirect
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err)
			res.redirect("/campgrounds");
		else{
			
			res.render("campgrounds/edit.ejs",{campground : foundCampground});
			
		}
	})
})




//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campgrounds
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	//redirect 
})


//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/campgrounds");
		else
			res.redirect("/campgrounds");
			
			
	})
})








module.exports= router;