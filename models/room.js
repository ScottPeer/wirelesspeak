/** Room Schema for Red Peak **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define schema
var RoomSchema = new Schema({
	name: { type: String, default: '' }
, created: { type: Date, default: new Date().toUTCString() }
, deleted: { type: Date, default: null }
, _account: { type: Schema.ObjectId, ref: 'User', default: null }
, _devices: { type: [{ type: Schema.ObjectId, ref: 'Device'}], default: [] }
, usage: { type: Number, default: 0 }
});

module.exports = mongoose.model('Room', RoomSchema);