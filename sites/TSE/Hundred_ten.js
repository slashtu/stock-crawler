/*

  http://2330.tw/TSE_8MajorTrader.aspx

  八大公股買賣超

*/

var Crawler = require("crawler");
var Lib = require('../../lib.js');

var table_name = 'HundredTen';

var update = function update( mongoose ){

    // schema
    var HundredTen = mongoose.Schema({
        hundred: Number,
        ten: Number,
        date: {type: Date},
    });

    // model
    var HundredTenModel = mongoose.model( table_name, HundredTen);

    HundredTen.pre('save', function(next){

        var self = this;

        HundredTenModel.find({date: self.date}, function(err, docs){
            if(docs.length){
                // console.log('exist');
            }else{
                // console.log('gg');
                next();
            }
        })
    })

    var stock = [];
 
    var c = new Crawler({

        // This will be called for each crawled page 
        callback : function (error, result, $) {

            $('#history').each(function(index, div) {

                var data = div.children[0].data.split('|');

                data.forEach( function( day, i ){
                    var hundred = day.split(',')[1];
                    var ten = day.split(',')[2];
                    var date = day.split(',')[3];

                    // console.log( 'i=' + i + ' ' + hundred + ' ' + date )

                    if(hundred)
                        stock.push({ hundred: hundred, ten: ten, date: new Date(date) });
                });

                Lib.upload2( table_name, stock.slice(0) )

                // stock.forEach(function(day , i){
                //     var trade = new HundredTenModel({ hundred: day.hundred, ten: day.ten, date: new Date(day.date)}); 

                //     trade.save();
                // });

                console.log( 'HundredTen Success ' + new Date() + ' date: ' + stock[0].date );
                // process.exit()
            });
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://2330.tw/TSE_100_10Price.aspx');
}

module.exports = { update: update };