module.exports = { 
  closeDB: function( mongoose ){
    console.log('disconnect'); 
    mongoose.disconnect(); 
  }
};