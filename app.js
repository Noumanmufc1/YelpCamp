var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require("method-override")
var Campground = require("./models/campground")
var seedDB = require("./seeds")
var Comment = require("./models/comment")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var User = require("./models/user")
var flash = require("connect-flash")

//require routes
var commentRoutes = require("./routes/comments")
var campgroundRoutes = require("./routes/campgrounds")
var indexRoutes = require("./routes/index")

  
mongoose.connect("mongodb://localhost/yelpCamp_Finals")
app.use(bodyParser.urlencoded({extended : true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash())
// seedDB(); //seed the database

app.use(require("express-session")({
	secret: "achhhhhh",
	resave: false,
	saveUninitialized: false
}))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error')
	res.locals.success = req.flash('success')
	next();
})

app.use("/", indexRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds", campgroundRoutes)

app.listen(3000, function() {
	console.log("YelpCamp server has Started!!")
})