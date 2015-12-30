/*

  http://2330.tw/TSE_8MajorTrader.aspx

  八大公股買賣超

*/

var Crawler = require("crawler");
var Lib = require('../../lib.js');

var update = function update( mongoose ){

    // schema
    var EightMjorTrader = mongoose.Schema({
        trade: Number,
        date: {type: Date}
    });

    // model
    var EightMjorTraderModel = mongoose.model('EightMajorTrader', EightMjorTrader);

    EightMjorTrader.pre('save', function(next){

        var self = this;

        EightMjorTraderModel.find({date: self.date}, function(err, docs){
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

                data.forEach( function( day ){
                    var trade = day.split(',')[4];
                    var date = day.split(',')[5];

                    if(trade)
                        stock.push({ trade: trade, date: new Date(date) });
                });

                Lib.upload2( 'EightMajorTrader', stock.slice(0) )

                // stock.forEach(function(day){
                //     var trade = new EightMjorTraderModel({ trade: day.trade, date: new Date(day.date)});
                //     trade.save();
                // });

                console.log( 'TSE EightMjorTraderModel Success ' + new Date() + ' date: ' + stock[0].date );
                // process.exit()
            });
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://2330.tw/TSE_8MajorTrader.aspx');
}

module.exports = { update: update };