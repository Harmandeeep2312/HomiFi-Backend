const Review = require("./models/reviewSchema");
const User = require("./models/userSchema.js");
const Content = require("./models/contentSchema.js")

module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        return res.status(401).json({ error: "You must be logged in" });
    }
    next(); 
};


module.exports.saveRedirectUrl = (req,res,next)=>{
   console.log(req.session.returnTo);
    if(req.session.returnTo){
        res.locals.redirectUrl = req.session.returnTo;
    }
    next();
};

 module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({ error: errMsg }); // ✅ send error directly
  } else {
    next();
  }
};

 

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({ error: "Review not found!" });
  }

  if (!review.author.equals(req.user._id)) {
    return res.status(403).json({ error: "You are not authorized to delete this review." });
  }

  next();
};