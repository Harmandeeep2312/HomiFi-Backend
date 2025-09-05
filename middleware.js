

module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You Must Be LoggedIn To Create Listing");
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