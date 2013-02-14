/** Device Schema for Red Peak **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define schema
var DeviceSchema = new Schema({
	name: { type: String, default: '' }
, created: { type: Date, default: new Date().toUTCString() }
, deleted: { type: Date, default: null }
, powered: { type: Boolean, default: false }
, _account: { type: Schema.ObjectId, ref: 'User', default: null }
, _room: { type: Schema.ObjectId, ref: 'Room', default: null }
, usage: { type: Number, default: 0 }
});

module.exports = mongoose.model('Device', DeviceSchema);