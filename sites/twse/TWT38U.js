/*

  http://www.twse.com.tw/ch/trading/fund/TWT38U/TWT38U.php

  外資及陸資買賣超彙總表

*/

var Crawler = require("crawler");
var Lib = require("../../lib.js");

var table_name = 'TWT38U';

function getValue( tr ){

    var no = tr.children[3].children[0].data;
    var name = tr.children[5].children[0].data;
    var buy = tr.children[7].children[0].data;
    var sell = tr.children[9].children[0].data;
    var diff = tr.children[11].children[0].data;
    
    return { no: no, name: name, buy: buy, sell: sell, diff: diff };
}

var update = function update( mongoose ){

    var TWT38USchema = mongoose.Schema({
        date: Date,
        stock: [],
    });

    // model
    var TWT38UModel = mongoose.model( table_name, TWT38USchema);

    TWT38USchema.pre('save', function(next){

        var self = this;

        TWT38UModel.find({date: self.date}, function(err, docs){
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

            var stock = [];

            var date = $("input[name='qdate']")[0].attribs.value;

            date = Lib.formatTimeTwaiwanToCE(date);
            
            $('tbody tr').each( function( index, tr ){

                var data = getValue( tr )

                stock.push(data);
            });

            // var twt38u = new TWT38UModel({ 
            //     date: new Date(date),
            //     stock: stock,
            // });

            // twt38u.save();

            Lib.upload2( table_name, [{ date: new Date(date), stock: stock }]);

            console.log( 'TWT38U Success ' + new Date() );
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://www.twse.com.tw/ch/trading/fund/TWT38U/TWT38U.php');
}

module.exports = { update: update };