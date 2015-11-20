var mongoose = require('mongoose');
var lib = require('./lib.js');

// connect db
mongoose.connect('mongodb://localhost/stock');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
//success
});

 
// ======================= TSE =========================

var TSE_AD = require("./sites/TSE/AD.js");
var TSE_AD_limit = require("./sites/TSE/AD_limit.js");
var EightMajorTrader = require("./sites/TSE/8majorTrader.js");
var TSE_Lending = require("./sites/TSE/Lending.js");
var TSE_HundredTen = require("./sites/TSE/Hundred_ten.js");
 
// task
// TSE_AD.update(mongoose);
// TSE_AD_limit.update(mongoose);
// EightMajorTrader.update(mongoose);
// TSE_Lending.update(mongoose);
// TSE_HundredTen.update(mongoose);

// ======================= wearn =========================

var fundthree = require("./sites/wearn/fundthree.js");

//task
fundthree.update(mongoose);



setTimeout( function(){mongoose.disconnect();}, 1000 * 60 * 60);