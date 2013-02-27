var express = require('express')
  , http = require('http')
  , connect = require('connect')
  , passport = require('passport')
	, fs = require('fs');

var app = express.createServer();

app.configure( function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    open: '{{',
    close: '}}'
  });
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'esoognom'}));
  app.use(passport.initialize());
	app.use(passport.session());
  app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
});

app.helpers({
  _: require("underscore")
});

app.dynamicHelpers({
  user: function (req, res) {
      return req.user;
  }
});

// load routes
var bootControllers = function bootControllers(app, express) {
  fs.readdir(__dirname + '/controllers', function(err, files) {
    if (err) throw err;
    require('./controllers/site')(app, express); // takes precidence
    files.forEach(function(file) {
      if(file[0] == '.') return;
      var name = file.replace('.js', '');
      if(name != 'site' && name != 'admin')
      	require('./controllers/' + name)(app, express);
    });
  });
}(app, express);

app.listen(80);
console.log('Listening on port 80');