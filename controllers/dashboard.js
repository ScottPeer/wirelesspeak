var mongoose = require('mongoose'),
	db = require('../lib/datastore.js');

module.exports = function site(app, express) {

  console.log('creating routes for /user/:id');
  
  app.get('/accounts/:id', db.requireLoggedIn, function(req, res){
  	var id = req.params.id,
  			accountId = new mongoose.Types.ObjectId(id);

  	db.Device.find( { _account: accountId })
		.populate('_room')
		.exec(function(err, devices){
			if (err) throw err;
			console.log(devices);
			var devicesByUsage = _.sortBy(_.filter(devices, function(device){ return device.powered; }), function(device){ return -device.usage });
						
			//$/W * 24 hr * usage W/hr = $day
			var costPerDay = (_.reduce(devices, function(total, device){ return device.powered ? total + device.usage : total; }, 0) * .0007 * 24).toFixed( 2 );

			res.render('dashboard', {
	      layout: 'dashboard.layout.jade',
	      current: 'dashboard',
	      devices: devices,
	      devicesByUsage: devicesByUsage,
	      costPerDay: costPerDay,
	      title: 'My Dashboard | Wireless Peak'

	    });
		});
  });
  
	app.put('/devices/:did/powered/on',  db.requireLoggedIn, function(req, res){
		
		console.log('powering device on');
		var query = req.query,
				did = req.params.did;
				
		var accountId = new mongoose.Types.ObjectId(req.user.id),
				deviceId = new mongoose.Types.ObjectId(did);

  	db.Device.findOne( { _id: deviceId, _account: accountId }, function(err, device){
  		if(err) throw err;
  		if(!device){
  			res.send( { success: false, msg: "Device not found" } );
  		}
  		else{
  			console.log('found device');
  			console.log(device);
  			device.powered = true;
  			device.save(function(err){
  				if(err) throw err;
  				res.send( { success: true} );
  			});
  		}
		});
	});
	
	app.put('/devices/:did/powered/off',  db.requireLoggedIn, function(req, res){
		
		console.log('powering device off');

		var query = req.query,
				did = req.params.did;

		var accountId = new mongoose.Types.ObjectId(req.user.id),
				deviceId = new mongoose.Types.ObjectId(did);
				
		var deviceQuery = { _account: accountId, device: deviceId };
		
		console.log(deviceQuery);

  	db.Device.findOne( { _id: deviceId, _account: accountId }, function(err, device){
  		if(err) throw err;
  		if(!device){
  			console.log('no device found');
  			res.send( { success: false, msg: "Device not found" } );
  		}
  		else{
  			console.log('found device');
  			console.log(device);
  			device.powered = false;
  			device.save(function(err){
  				if(err) throw err;
  				res.send( { success: true} );
  			});
  		}
		});
	});
}