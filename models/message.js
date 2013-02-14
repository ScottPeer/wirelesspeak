/** Device Schema for Red Peak **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define schema
var MessageSchema = new Schema({
	mid: { type: String, default: '' }
, created: { type: Date, default: new Date().toUTCString() }
, deleted: { type: Date, default: null }
, messages: { type: [ String ], default: [] }

});

module.exports = mongoose.model('Message', MessageSchema);