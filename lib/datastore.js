// dependencies for authentication
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	_ = require('underscore'),
	mongo = require('mongodb'),
	bcrypt = require('bcrypt'),
	BSON = mongo.BSONPure;

var User = require('../models/user');
var Room = require('../models/room');
var Device = require('../models/device');
var Message = require('../models/message');

var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = mongoose.SchemaTypes.ObjectId
,	mongooseTypes = require('mongoose-types');

function Models(){

	var self = this;
	this.User = User;
	this.Room = Room;
	this.Device = Device;
	this.Message = Message;
	mongoose.connect('mongodb://admin:redpeak_IDEA1@ds047207.mongolab.com:47207/redpeak');
	this.connection = mongoose.connection;
};

module.exports =  new Models();

Models.prototype.requireLoggedIn = function(req, res, next) {
	req.user === undefined
  ?	res.redirect('/accounts/')
  : next(); 
}

//Define local strategy for Passport
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
  	console.log('in passport., about to user.auth for' + email);
    User.authenticate(email.trim(), password, function(err, user) {
    	console.log('returning done');
      return done(err, user);
    });
  }
));
      
// serialize user on login
passport.serializeUser(function(user, done) {
	//console.log('serializing user');
	//console.log(user);
  done(null, user.id);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
  User.findById(id)
  .populate('companyRoles._company', ['name', '_id'])
  .exec(function (err, user) {
    done(err, user);
  });
});