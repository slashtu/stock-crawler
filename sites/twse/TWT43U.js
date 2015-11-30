/*

  http://www.twse.com.tw/ch/trading/fund/TWT43U/TWT43U.php

  自營商買賣超彙總表

*/

var Crawler = require("crawler");
var Lib = require("../../lib.js");

function getValue( tr ){
   
    var no = tr.children[1].children[0].data;
    var name = tr.children[3].children[0].data;

    var selfSelfbuy = tr.children[5].children[0].data;
    var selfSelfsell = tr.children[7].children[0].data;
    var selfSelfdiff = tr.children[9].children[0].data;

    var selfHedgebuy = tr.children[11].children[0].data;
    var selfHedgesell = tr.children[13].children[0].data;
    var selfHedgediff = tr.children[15].children[0].data;

    var selfbuy = tr.children[17].children[0].data;
    var selfsell = tr.children[19].children[0].data;
    var selfdiff = tr.children[21].children[0].data;
    
    return { 
        no: no, 
        name: name, 
        
        selfSelf:{
            buy: selfSelfbuy,
            sell: selfSelfsell,
            diff: selfSelfdiff,
        },

        selfHedge:{
            buy: selfHedgebuy,
            sell: selfHedgesell,
            diff: selfHedgediff,
        },

        self:{
            buy: selfbuy,
            sell: selfsell,
            diff: selfdiff,
        },
    };
}

var update = function update( mongoose ){

    var TWT43USchema = mongoose.Schema({
        date: Date,
        stock: [],
    });

    // model
    var TWT43UModel = mongoose.model('TWT43U', TWT43USchema);

    TWT43USchema.pre('save', function(next){

        var self = this;

        TWT43UModel.find({date: self.date}, function(err, docs){
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

                var data = getValue( tr );

                stock.push(data);
            });

            var twt43u = new TWT43UModel({ 
                date: new Date(date),
                stock: stock,
            });

            twt43u.save();

            console.log( 'TWT43U Success ' + new Date() );
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://www.twse.com.tw/ch/trading/fund/TWT43U/TWT43U.php');
}

module.exports = { update: update };