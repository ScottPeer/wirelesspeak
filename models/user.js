/** User Schema for RedPeak **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var bcrypt = require('bcrypt');

// Define schema
var UserSchema = new Schema({
    name : { 
        first: { type: String, default: null } 
      , last: { type: String, default: null}
    }
  , email: { type: String, unique: true }
  , salt: { type: String, default: null }
  , hash: { type: String, default: null }
	, created: { type: Date, default: null }
});


UserSchema
.virtual('password')
.get(function () {
  return this._password;
})
.set(function (password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});

UserSchema
.virtual('name.full')
.get(function () {
	return (this.name.first != null && this.name.last != null ) ? this.name.first + ' ' + this.name.last : null;
})

UserSchema.method('verifyPassword', function(password, callback) {
	console.log('brcrypt pre')
  bcrypt.compare(password, this.hash, callback);
	console.log('brcrypt post')
});

UserSchema.static('authenticate', function(email, password, callback) {
  this.findOne({ email: email.toLowerCase(), created: { $ne: null } })
	.exec(function(err, user) {
      if (err) { return callback(err); }
      console.log('in authenticate user');
      console.log(user);
      if (!user) { return callback(null, false); }
      user.verifyPassword(password, function(err, passwordCorrect) {
        if (err) { return callback(err); }
        console.log('verified password')
        if (!passwordCorrect) { return callback(null, false); }
        return callback(null, user);
      });
    });
});

module.exports = mongoose.model('User', UserSchema);