/*

  http://mops.twse.com.tw/mops/web/t90sb03

  上市權證造市專戶庫存不足500張彙總表

*/

var Crawler = require("crawler");

function getValue( tr ){
   
    var pub_no = tr.children[3].children[0].data;
    var pub = tr.children[5].children[0].data;

    var war_no = tr.children[7].children[0].data;
    var war = tr.children[9].children[0].data;

    var target_no = tr.children[11].children[0].data;
    var target = tr.children[13].children[0].data;
    
    var count = tr.children[15].children[0].data;
    
    return { 
        pub_no: pub_no,
        pub: pub,

        war_no: war_no,
        war: war,

        target_no: target_no,
        target: target,

        count: count,
    };
}

var update = function update( mongoose ){

    var T90sb03Schema = mongoose.Schema({
        date: Date,
        stock: [],
    });

    // model
    var T90sb03Model = mongoose.model('T90sb03', T90sb03Schema);

    T90sb03Schema.pre('save', function(next){

        var self = this;

        T90sb03Model.find({date: self.date}, function(err, docs){
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

            var date = $('span[class="note"]')[0].children[0].data.replace(/(\n)+/g, '').substring(5,14);

            var year = parseFloat(date.split('/')[0]) + 1911;
            var month = parseFloat(date.split('/')[1]);
            var day = parseFloat(date.split('/')[2]);

            var today = [ year, month, day ].join('/');

            var stock = [];
            
            $('.hasBorder tr').each( function( index, tr ){

                if( tr.attribs.class === 'tblHead' ) return;

                var data = getValue( tr );

                stock.push(data);
            });

            var t90sb03 = new T90sb03Model({ 
                date: new Date(today),
                stock: stock,
            });

            t90sb03.save();

            console.log( 'T90sb03 Success ' + new Date() );
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://mops.twse.com.tw/mops/web/t90sb03');
}

module.exports = { update: update };