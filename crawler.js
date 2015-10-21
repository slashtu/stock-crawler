var Crawler = require("crawler");
var url = require('url');
var GoogleSpreadsheet = require("google-spreadsheet");
var sleep = require('sleep');

var my_sheet = new GoogleSpreadsheet('1zb7vt_nBFmVJUFwhNJPlLkN1NFlDOmdHsZPRV_bmVi0');
 
var creds = require('./stock-dd612dc6478e.json');

var stock = [];

function add( index, sheet ){

    var day = stock[index];

    sheet.addRow({date: day.date, advStocks: day.adv, decStocks: day.dec}, function(){

        console.log('add ' + index);

        if( index + 1 >= stock.length ) return;

        add( index + 1 , sheet);
    })
}
 
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
                    stock.push({ adv: adv, dec: dec, date: date });
            });


            // store to google sheet
            my_sheet.useServiceAccountAuth(creds, function(err){

                my_sheet.getInfo( function( err, sheet_info ){ 
             
                    var sheet1 = sheet_info.worksheets[0];

                    // var x = 0;

                    var day = stock[0];

                    sheet1.addRow({date: day.date, advStocks: day.adv, decStocks: day.dec});
       
                });
            })

        });
    }
});
 
// Queue just one URL, with default callback 
c.queue('http://2330.tw/TSE_Main.aspx');