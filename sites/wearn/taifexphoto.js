/*

  http://stock.wearn.com/taifexphoto.asp

  台指期未平倉(大額近月、法人所有月)

*/

var Crawler = require("crawler");
var Lib = require("../../lib.js");

function getValue( tr ){

    var date = Lib.formatTimeTwaiwanToCE(tr.children[1].children[0].data);
    var top5 = tr.children[3].children[0].children[0].data;
    var top10 = tr.children[5].children[0].children[0].data;
    var top5sp = tr.children[7].children[0].children[0].data;
    var top10sp = tr.children[9].children[0].children[0].data;
    var wai = tr.children[11].children[0].children[0].data;
    var tau = tr.children[13].children[0].children[0].data;
    var self = tr.children[15].children[0].children[0].data;
    var close = tr.children[17].children[0].data;

    var value = { date: date, top5: top5, top10: top10, top5sp: top5sp, top10sp: top10sp, wai: wai, tau: tau, self: self, close: close }

    return value;
}

var update = function update( mongoose ){

    var TaifexSchema = mongoose.Schema({
        top5: Number,
        top10: Number,
        top5sp: Number,
        top10sp: Number,
        wai: Number,
        tau: Number,
        self: Number,
        close: Number,
        date: Date,
    });

    // model
    var TaifexModel = mongoose.model('Taifex', TaifexSchema);

    TaifexSchema.pre('save', function(next){

        var self = this;

        TaifexModel.find({date: self.date}, function(err, docs){
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

            // console.log( $('tr[bgcolor]') )

            $('tr[bgcolor]').each( function( index, tr ){

                var day = getValue( tr )

                var taifex = new TaifexModel({ 
                    date: new Date(day.date), 
                    top5: day.top5, 
                    top10: day.top10, 
                    top5sp: day.top5sp, 
                    top10sp: day.top10sp, 
                    wai: day.wai, 
                    tau: day.tau, 
                    self: day.self, 
                    close: day.close  });

                taifex.save();

            });

            console.log( 'taifex Success ' + new Date() );
        }
    });
 
    // Queue just one URL, with default callback 
    c.queue('http://stock.wearn.com/taifexphoto.asp');
}

module.exports = { update: update };