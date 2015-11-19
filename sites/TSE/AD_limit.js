/*

  http://2330.tw/TSE_Main.aspx?kind=b

  漲跌停家數

*/

var Crawler = require("crawler");

var update = function update( mongoose ){

    var ADSchema = mongoose.Schema({
        adv: Number,
        dec: Number,
        date: {type: Date}
    });

    // model
    var AD = mongoose.model('ADLimit', ADSchema);

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

    var stock = [];
 
    var c = new Crawler({

        // This will be called for each crawled page 
        callback : function (error, result, $) {

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

                console.log( 'TSE AD Limit Success ' + new Date() + ' date: ' + stock[0].date );
                // process.exit()
            });
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://2330.tw/TSE_Main.aspx?kind=b');
}

module.exports = { update: update };