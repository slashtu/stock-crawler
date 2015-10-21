var GoogleSpreadsheet = require("google-spreadsheet");
 
// spreadsheet key is the long id in the sheets URL 
var my_sheet = new GoogleSpreadsheet('1zb7vt_nBFmVJUFwhNJPlLkN1NFlDOmdHsZPRV_bmVi0');
 
var creds = require('./stock-dd612dc6478e.json');
 
my_sheet.useServiceAccountAuth(creds, function(err){

    my_sheet.getInfo( function( err, sheet_info ){ 
 
        var sheet1 = sheet_info.worksheets[0];

        sheet1.addRow({date:'2015/10/20', 'value':20})
    });
})
