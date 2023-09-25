const checkIfAuthenticated=(req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
  }

  // Redirect authenticated users away from /login and /register routes
function redirectIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

  module.exports= {checkIfAuthenticated, redirectIfAuthenticated};