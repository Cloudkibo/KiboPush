var mongoose = require('mongoose');
// mongoose.connect('http://localhost:27017/kibopush');
// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/kibopush');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Yippie we are connected");
});

exports.mongoose = mongoose;
