/*

  http://2330.tw/TSE_8MajorTrader.aspx

  八大公股買賣超

*/

var Crawler = require("crawler");

var update = function update( mongoose ){

    // schema
    var LendingTrader = mongoose.Schema({
        short: Number,
        balance: Number,
        date: {type: Date},
    });

    // model
    var LendingTraderModel = mongoose.model('Lending', LendingTrader);

    LendingTrader.pre('save', function(next){

        var self = this;

        LendingTraderModel.find({date: self.date}, function(err, docs){
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
                    var short = day.split(',')[1];
                    var balance = day.split(',')[2];
                    var date = day.split(',')[3];

                    if(short)
                        stock.push({ short: short, balance: balance, date: new Date(date) });
                });

                stock.forEach(function(day){
                    var trade = new LendingTraderModel({ short: day.short, balance: day.balance, date: new Date(day.date)});
                    trade.save();
                });

                console.log( 'TSE_Lending Success ' + new Date() + ' date: ' + stock[0].date );
                // process.exit()
            });
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://2330.tw/TSE_Lending.aspx');
}

module.exports = { update: update };