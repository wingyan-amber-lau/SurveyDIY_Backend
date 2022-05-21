/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Configure database
*/

let config = require('./config')
// Database Setup
let mongoose = require('mongoose');

module.exports = function(){  

    // Connect to the DB
    mongoose.connect(config.ATLASDB);

    let mongoDB = mongoose.connection;

    mongoDB.on('error', console.error.bind(console, 'Connection Error: '));
    mongoDB.once('open', ()=>{
        console.log('Connected to MongoDB...');
    })

    return mongoDB;
}

