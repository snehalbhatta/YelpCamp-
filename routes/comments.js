//implementing express router
var express= require("express");
var router= express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var User= require("../models/user");
var middleware=require("../middleware");



// =======================
// COOMENTS ROUTE
// =======================

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn,function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new.ejs", {campground: campground});
        }
    })
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
			   req.flash("error","Something went wrong");
               console.log(err);
           } else {
			   //add the  username and id to the comment
			   comment.author.id = req.user._id;
			   comment.author.username= req.user.username;
			   //save the comment again 
			   comment.save();
               campground.comments.push(comment);
               campground.save();
			   req.flash("success","Successfully added a comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


//Edit route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{
	
			res.render("comments/edit.ejs",{campground_id:req.params.id, comment:foundComment  });
			
		}
	})
})

//update route
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	//find and update the correct campgrounds
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	//redirect 
})


//delete route

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){ 
		if(err)
			res.redirect("/campgrounds");
		else{
				
				res.redirect("/campgrounds"+req.params.id);
				req.flash("success"," You have just deleted a comment");
			
		}
			
			
			
	})
})






module.exports= router;