var mongoose = require('mongoose');

// connect db
mongoose.connect('mongodb://localhost/stock');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
});

var TSE_AD = require("./sites/TSE/AD.js");
var TSE_AD_limit = require("./sites/TSE/AD_limit.js");
var EightMajorTrader = require("./sites/TSE/8majorTrader.js");
 
// TSE
TSE_AD.update(mongoose);
TSE_AD_limit.update(mongoose);
EightMajorTrader.update(mongoose);