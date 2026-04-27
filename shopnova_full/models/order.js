
const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
 customerEmail:String, items:Array, status:String
}));
