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
};