var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var broadcastSchema = new Schema({
    platform: String,
    type: String,
    poll: [{
        statement: String,
        options: [{
            optionStatment: String,
        }]
    }],
    survey:[{
        statement: String,
        isMultiple: String,
        options:[{
            optionStatment: String,
        }],
    }],
    link: {
        linkTitle: String,
        linkDescription: String,
        linkUrl: String,
    },
    media: {
        url: String,
        type: String,
        name: String,
    },
    message: String,
    userId: String,
    pageId: String,
});

module.exports = mongoose.model('broadcasts', broadcastSchema);
