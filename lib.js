require('es6-promise').polyfill();
require('isomorphic-fetch');

var http = require('http');
http.post = require('http-post');

module.exports = { 
  
  closeDB: function( mongoose ){
    console.log('disconnect'); 
    mongoose.disconnect(); 
  },

  formatTimeTwaiwanToCE: function( taiwanDate ){
    var year = parseFloat(taiwanDate.split('/')[0]) + 1911;
    var month = parseFloat(taiwanDate.split('/')[1]);
    var day = parseFloat(taiwanDate.split('/')[2]);

    var today = [ year, month, day ].join('/');

    return today;
  },

  upload: function( table, key, data ){

    console.log('go')

    fetch('http://ywssdb.ddns.net/api/receiver.php', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
              table: table,
              key: key,
              data: JSON.stringify(data)
            }
    })
    .then(function( response ){
      return response.text()
    })
    .then(function(data){
      console.log('request succeeded with JSON response', data)
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
  },

  upload2: function( table, data ){

    if(data.length === 0) return;

    var upload_data = data.shift();
    var key = upload_data.date.getTime()

    var self = this;

    http.post('http://ywssdb.ddns.net/api/receiver.php', { table: table, key: key, data: JSON.stringify(upload_data)}, function(res){
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        // console.log(chunk);
        self.upload2( table, data);
      });
    });
  }
};