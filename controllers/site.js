var nodemailer = require('nodemailer');

module.exports = function site(app, express) {

  console.log('creating routes for /');
  
  app.get('/', function(req, res){
    res.render('index', {
      layout: 'layout.jade',
      current: 'index',
      title: 'Wireless Peak'
    });
  });

  app.get('/about', function(req, res){
    res.render('about', {
      layout: 'layout.jade',
      current: 'about',
      title: 'About Us | Wireless Peak'
    });
  });

  app.get('/news', function(req, res){
    res.render('news', {
      layout: 'layout.jade',
      current: 'news',
      title: 'News | Wireless Peak'
    });
  });

  app.get('/products', function(req, res){
    res.render('products', {
      layout: 'layout.jade',
      current: 'products',
      title: 'Products | Wireless Peak'
    });
  });

  app.get('/accounts', function(req, res){
    res.render('accounts', {
      layout: 'layout.jade',
      current: 'accounts',
      title: 'My Account | Wireless Peak'
    });
  });

  app.get('/contact', function(req, res){
  	var query = req.query,
  		msg = query.msg;
    res.render('contact', {
      layout: 'layout.jade',
      current: 'contact',
      msg: msg != undefined ? msg : null,
      title: 'Contact Us | Wireless Peak'
    });
  });  
  
  app.get('/thanks', function(req, res){
  	var query = req.query,
  		msg = query.msg;
    res.render('thanks', {
      layout: 'layout.jade',
      current: 'thanks',
    	title: 'Thanks for Contacting Us | Wireless Peak'
    });
  });  
  
  app.post('/contact', function(req, res){
  	console.log('posting to contact');
  	var name = req.param('name').trim();
  	var email = req.param('email').trim();
  	var message = req.param('message');
    
		var transport = nodemailer.createTransport("SES", {
				AWSAccessKeyID: "AKIAI5KPLZVQ3MKDXLPQ",
				AWSSecretKey: "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"
		});
		
		
		// setup e-mail data with unicode symbols
		var mailOptions = {
				from:  "Wireless Peak Contact <scott.peer@redpeakengineering.com>", // sender address
				to: "scott.peer@redpeakengineering.com", // list of receivers
				subject: "WirelessPeak Inquiry from " + email, // Subject line
				text: "From: " + name + "\n Email: " + email + "/n/n" + message, // plaintext body
				html: "<p style='width: 100%; margin-bottom: 10px'><b>From:</b> " + name + "</p><p style='width: 100%; margin-bottom: 10px'>" + "<b>Email:</b> " + email + "</p><p style='width: 100%; margin-bottom: 10px'>" + "<b>Message:</b> " + message + "</p>"// html body
		}
		
		// send mail with defined transport object
		transport.sendMail(mailOptions, function(error, response){
				if(error){
						console.log(error);
				}else{
						console.log("Message sent: " + response.message);
				}
				res.redirect('/thanks');
		});
    
  });  
 
}