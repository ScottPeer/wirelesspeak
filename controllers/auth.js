var db = require('../lib/datastore'),
		mongoose = require('mongoose'),
    _ = require('underscore'),
    bcrypt = require('bcrypt'),
    passport = require('passport');

module.exports = function site(app, express) {

  console.log('creating routes for authentication');	

  app.post('/', function(req, res, next) {
  	var self = this;
  	console.log('loggin in');
    passport.authenticate('local', function(err, user, info) {
      if (err) { return self.next(err) }
      console.log('after passport auth');
      if (!user) { 
      	console.log('login failed');
      	return res.redirect('/accounts');  
      }
      else{
      	console.log('about to log in');
	      req.logIn(user, function(err) {
	      	console.log('logged in');
	        if (err) { return self.next(err); }
	        return res.redirect('/accounts/' + user._id);  
	      });
  		}
    })(req, res, next);
  });
};