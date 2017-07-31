let mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  name: String,
  email: String,
  locale: String,
  gender: String,
  provider: String,
  timezone: Number,
  fbId: String,
  profilePic: String,
  fbToken: String,
});

module.exports = mongoose.model('users', userSchema);
