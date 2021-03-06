var express     = require("express"),
    app         = express(),
	flash		=require("connect-flash"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
	methodOverride= require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

//THE LOCAL LINK   
// mongoose.connect("mongodb://localhost:27017/yelp_camp_v12",{useNewUrlParser:true});

mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});
//THE CLUSTER LINK
// mongodb+srv://snehalbhatta:stupwdS9024@cluster0-13e35.mongodb.net/yelp_camp?retryWrites=true&w=majority

app.use(bodyParser.urlencoded({extended: true}));
// app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//methodoverirde implementation
app.use(methodOverride("_method"));

//implementing flash messages
app.use(flash());


 // seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//basically making the currentUser and message variables global and accessible throughout the app
app.use(function(req, res, next){
  
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	
   	next();
});

app.use( indexRoutes);
app.use( campgroundRoutes);
app.use(commentRoutes);

// app.listen(3000,function(){
// 	console.log("The server is running");
// })

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
