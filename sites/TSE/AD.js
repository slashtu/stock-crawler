/*

  http://2330.tw/TSE_Main.aspx

  上漲家數  下跌家數  

*/

var Crawler = require("crawler");
var mongoose = require('mongoose');

// connect db
mongoose.connect('mongodb://localhost/stock');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
});

// schema
var ADSchema = mongoose.Schema({
    adv: Number,
    dec: Number,
    date: {type: Date}
});

// model
var AD = mongoose.model('AD', ADSchema);

ADSchema.pre('save', function(next){

    var self = this;

    AD.find({date: self.date}, function(err, docs){
        if(docs.length){
            // console.log('exist');
        }else{
            // console.log('gg');
            next();
        }
    })
})

var all = function all(){

    var stock = [];

 
    var c = new Crawler({

        // This will be called for each crawled page 
        callback : function (error, result, $) {
            // $ is Cheerio by default 
            //a lean implementation of core jQuery designed specifically for the server 
            $('#history').each(function(index, div) {

                var data = div.children[0].data.split('|');

                data.forEach( function( day ){
                    var adv = day.split(',')[4];
                    var dec = day.split(',')[5];
                    var date = day.split(',')[6];

                    if(adv)
                        stock.push({ adv: adv, dec: dec, date: new Date(date) });
                });

                stock.forEach(function(day){
                    var ad = new AD({adv: day.adv, dec: day.dec, date: new Date(day.date)});
                    ad.save();
                });

                console.log( 'TSE AD Success ' + new Date() + ' date: ' + stock[0].date );
                // process.exit()
            });
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://2330.tw/TSE_Main.aspx');
}

module.exports = { update: update };