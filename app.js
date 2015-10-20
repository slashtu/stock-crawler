var GoogleSpreadsheet = require("google-spreadsheet");
 
// spreadsheet key is the long id in the sheets URL 
var my_sheet = new GoogleSpreadsheet('1zb7vt_nBFmVJUFwhNJPlLkN1NFlDOmdHsZPRV_bmVi0');
 
// Without auth -- read only 
// IMPORTANT: See note below on how to make a sheet public-readable! 
// # is worksheet id - IDs start at 1 
// my_sheet.getRows( 1, function(err, row_data){
//     console.log( 'pulled in '+row_data.length + ' rows');
// });
 
// With auth -- read + write 
// see below for authentication instructions 
var creds = require('./stock-dd612dc6478e.json');
// OR, if you cannot save the file locally (like on heroku) 
// var creds = {
//   client_email: 'yourserviceaccountemailhere@google.com',
//   private_key: 'your long private key stuff here'
// }
 
my_sheet.useServiceAccountAuth(creds, function(err){
    // getInfo returns info about the sheet and an array or "worksheet" objects 
    my_sheet.getInfo( function( err, sheet_info ){
        console.log( sheet_info.title + ' is loaded' );
        // use worksheet object if you want to stop using the # in your calls 
 
        var sheet1 = sheet_info.worksheets[0];
        console.log(sheet_info)
        // sheet1.getRows( function( err, rows ){

        //     console.log(rows)
        //     rows[0].A = 'new val';
        //     rows[0].save(); //async and takes a callback 
        //     // rows[0].del();  //async and takes a callback 
        // });

        sheet1.addRow({name:'slash', age:20})
    });
 
    // column names are set by google and are based 
  // on the header row (first row) of your sheet 

    // my_sheet.addRow( 2, { colname: 'col value'} );
 
    // my_sheet.getRows( 2, {
    //     start: 100,          // start index 
    //     num: 100,              // number of rows to pull 
    //     orderby: 'name'  // column to order results by 
    // }, function(err, row_data){
    //     console.log(row_data)
    //     // do something... 
    // });
})
