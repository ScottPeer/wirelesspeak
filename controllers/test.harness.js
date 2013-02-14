_ = require('underscore'),
	db = require('../lib/datastore.js');


module.exports = function site(app, express) {

  console.log('creating routes for /test');
  
  
  app.get('/test', function(req, res){
  	var query = req.query,
  	id = req.params.id;
     
  	res.render('test/onoff', {
      layout: 'test.layout.jade',
    });
  });
  
  app.get('/test/:id/messages', function(req, res){
  	var query = req.query,
  	id = req.params.id;
  	
  	db.Message.findOne( { "mid": id }, function(err, message){
  		if(err) throw err;
  		var messages = message != null ? message.messages : [];
  		res.render('test/messages', {
				layout: 'test.layout.jade',
				id: id,
				messages: messages
			});		
		});
  });
  
  
  app.post('/test/:id/messages/new', function(req, res){
  	var post = req.body,
	  	id = req.params.id,
	  	m = post.message;
  	
  	
  	db.Message.findOne( { "mid": id }, function(err, message){
  		if(err) throw err;
  		if(message == null){
  			message = new db.Message( { "mid": id, "created": new Date().toUTCString() } );  			
  		}
  		message.messages.unshift(m);
  		message.save(function(err){
  			if(err) throw err;
  			res.writeHead(303, { 'Location': '/test/' + id + '/messages/'});
				res.end();
  		});
		}); 	
  });
  
  app.post('/test/on', function(req, res){
  	res.send( { success: true } );
  });
  
  app.post('/test/off', function(req, res){
  	res.send( { success: true } );
  });
}