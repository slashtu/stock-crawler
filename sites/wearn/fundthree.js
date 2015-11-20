/*

  http://stock.wearn.com/fundthree.asp

  三大法人買賣

*/

var Crawler = require("crawler");

function getValue( tr ){
    
    var buy = tr.children[3].children[0].children[0].data;
    var sell = tr.children[5].children[0].children[0].data;
    var diff = tr.children[7].children[0].children[0].data;

    if( diff.charAt(0) === '+' )
        diff = parseFloat( diff.replace('+', ''));
    else
        diff = 0 - parseFloat( diff.replace('-', ''));

    return { buy: buy, sell: sell, diff: diff }
}

function getDate( tr ){
    return new Date(tr.children[1].children[0].data);
}

var update = function update( mongoose ){

    var FundThreeSchema = mongoose.Schema({
        selfSelf: { buy: Number, sell: Number, diff: Number },
        date: Date
    });

    // model
    var FundThree = mongoose.model('FundThree', FundThreeSchema);

    FundThreeSchema.pre('save', function(next){

        var self = this;

        FundThree.find({date: self.date}, function(err, docs){
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

            // console.log($('table tr')[2].children[5])

            var selfSelf = getValue( $('table tr')[2]);
            var selfHedge = getValue( $('table tr')[3]);
            var tau = getValue( $('table tr')[4]);
            var wai = getValue( $('table tr')[5]);

            var today = getDate( $('.stockalllistbg6')[0] );

            var fundthree = new FundThree({ selfSelf: selfSelf, date: today });
            fundthree.save();
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://stock.wearn.com/fundthree.asp');
}

module.exports = { update: update };