const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    paragraphs: [{
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Article', articleSchema);
