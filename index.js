const express = require("express");
const path = require("path");
const cors = require("cors");
const Content = require("./models/contentSchema.js");
const mongoose = require("./init/loader.js");
const app=express();
const User = require("./models/userSchema.js");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const LocalStratergy = require("passport-local"); 
const {saveRedirectUrl, isLoggedIn} = require("./middleware.js");
app.use(cors({
  origin: "https://homifi-frontend.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));
app.use(express.json());
const sessionOption = {
    secret: "hlw", 
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 } 
};

app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
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
    const blog = await Content.findById(req.params.id).populate("author", "username email");

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
app.put("/blog/:id", isLoggedIn ,async(req,res)=>{
    let {id}= req.params;
    let blog = await Content.findById(id);

     if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

    if (!blog.author || blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "You are not authorized to edit this blog" });
  }
    const afterUpdate = await Content.findByIdAndUpdate(id,{title:req.body.title,content:req.body.content},{new: true});
    res.json(afterUpdate);

});
app.delete("/blog/:id",isLoggedIn ,async (req,res)=>{
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
app.post("/login",saveRedirectUrl,passport.authenticate("local" , {failureRedirect: "/login",failureFlash: true}),(req,res)=>{
    let redirectUrl = req.session.returnTo || "/"
    delete req.session.returnTo;
    res.json({ message: "Login successful", redirectUrl });
})

app.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.json({ message: "Logged out successfully" });
  });
});

const port = 8080;
app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})
