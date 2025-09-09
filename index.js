const express = require("express");
const path = require("path");
const cors = require("cors");
const Content = require("./models/contentSchema.js");
const Review = require("./models/reviewSchema.js");
const mongoose = require("./init/loader.js");
const app=express();
const User = require("./models/userSchema.js");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const LocalStratergy = require("passport-local"); 
const {saveRedirectUrl, isLoggedIn, validateReview , isReviewAuthor} = require("./middleware.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");

app.use(cors({
  origin: "https://homifi-frontend.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));
app.set("trust proxy", 1);
app.use(express.json());
const sessionOption = {
    secret: "hlw", 
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24,
     sameSite: "none",   
    secure: true  
    } 
};

app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.use(new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE,
      callbackURL: "https://homifi-backend.onrender.com/auth/google/callback",

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
     
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
         
          user = new User({
            username: profile.displayName,   
            email: profile.emails[0].value, 
            googleId: profile.id,           
          });
          await user.save();
        }
          return done(null, user);
      } catch (err) {
        return done(err, null);
        }
    }
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/blog" ,async (req,res)=>{
    try {
    let contents = await Content.find({}).populate("author", "username email");

   const result = contents.map((blog) => {
      const blogObj = blog.toObject();

      blogObj.author = blogObj.author || { username: "Anonymous" };

      blogObj.isAuthor =
        req.user && blogObj.author._id
          ? req.user._id.toString() === blogObj.author._id.toString()
          : false;

      return blogObj;
    });

    res.json(result);
}catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/blog/:id", async (req, res) => {
  try {
    const blog = await Content.findById(new mongoose.Types.ObjectId(req.params.id)).populate("author", "username email").populate({
    path: "reviews",
    populate: { path: "author", select: "username" }
  });;

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      author: blog.author ? blog.author : { username: "Anonymous" },
      date: blog.date,
    });
  } catch (err) {
    res.status(500).json({ error: "Invalid blog ID format or server error" });
  }
});
app.post("/blog/new", async(req,res)=>{
    const collectContent = {
        title:req.body.title,
        content:req.body.content,
        author: req.user ? req.user._id : null
    };
    const newContent = new Content(collectContent);
    await newContent.save();
    res.json(newContent);
});
app.put("/blog/:id",isLoggedIn ,async(req,res)=>{
    let {id}= req.params;
    let blog = await Content.findById(id);

     if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

    const afterUpdate = await Content.findByIdAndUpdate(id,{title:req.body.title,content:req.body.content},{new: true});
    res.json(afterUpdate);

});
app.delete("/blog/:id", isLoggedIn,async (req,res)=>{
     console.log("req.user in delete:", req.user); 
  console.log("session:", req.session);         
    let {id} = req.params;
    const blog = await Content.findById(id);
    await Content.findByIdAndDelete(id);
    res.json({ message: "Content deleted successfully" });
});

app.get("/signup", async(req,res)=>{
    res.json({ message: "Signup page - use POST /signup to create account" });
});
app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let newuser = new User({ username, email });
    let registeredUser = await User.register(newuser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); 
      }
      res.status(201).json({ message: "User created successfully" });
    });
  }  catch (err) {
  console.error("Signup error:", err); 
  res.status(500).json({ error: err.message });
}
})


app.get("/login" , (req,res)=>{
  res.json({ message: "Login page - use POST /login to authenticate" });
})
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Login successful", user: { _id: user._id, username: user.username } });
    });
  })(req, res, next);
});



app.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    
    res.redirect("https://homifi-frontend.onrender.com"); 
  }
);

app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.json({ message: "Logged out successfully" });
  });
});
app.get("/blog/:id", async (req, res) => {
  try {
    const blog = await Content.findById(req.params.id)
      .populate("author", "username")
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
      });

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      author: blog.author || { username: "Anonymous" },
      date: blog.date,
      reviews: blog.reviews.map((r) => ({
        _id: r._id,
        comment: r.comment,
        rating: r.rating,
        author: r.author ? r.author.username : "Anonymous",
        date: r.date,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/blog/:id/review", isLoggedIn, async (req, res) => {
  console.log("POST /blog/:id/review called");
console.log("Blog ID:", req.params.id);
console.log("Request body:", req.body);

  try {
    let { id } = req.params;
    let content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ error: "Blog not found" });
    }

    let newReview = new Review({
      comment: req.body.comment,
      rating: req.body.rating,
      author: req.user._id,  
    });

    content.reviews.push(newReview._id);

    await newReview.save();
    await content.save();

    res.status(201).json({ message: "New review created", review: newReview });
  } catch (err) {
    console.error(" Review creation error:", err);  
    res.status(500).json({ error: "Server error while creating review" });
  }
});
app.delete("/blog/:id/review/:reviewId", isLoggedIn, isReviewAuthor,async(req,res)=>{
    let {id, reviewId}= req.params;
    await Content.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     return res.redirect(`/blog/${id}`);
})
const port = 8080;
app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})
