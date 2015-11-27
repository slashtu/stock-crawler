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
TSE_AD.update(mongoose);
TSE_AD_limit.update(mongoose);
EightMajorTrader.update(mongoose);
TSE_Lending.update(mongoose);
TSE_HundredTen.update(mongoose);

// ======================= wearn =========================

var fundthree = require("./sites/wearn/fundthree.js");
var taifexphoto = require("./sites/wearn/taifexphoto.js");

//task
fundthree.update(mongoose); //time error
taifexphoto.update(mongoose); //time error

// ======================= twse =========================

var TWT44U = require("./sites/twse/TWT44U.js");
var TWT38U = require("./sites/twse/TWT38U.js");
var TWT43U = require("./sites/twse/TWT43U.js");

//task
TWT44U.update(mongoose); //time error
TWT38U.update(mongoose); //time error
TWT43U.update(mongoose); //time error

// ======================= mops =========================
var t90sb03 = require("./sites/mops/t90sb03.js");

//task
t90sb03.update(mongoose);

setTimeout( function(){mongoose.disconnect();}, 1000 * 60 * 60);