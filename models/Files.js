const {Schema, model, ObjectId} = require('mongoose');

const File = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    accessLink: {type: String},
    size: {type: Number, default: 0},
    path: {type: String, default: ''},
    date: {type: Date, default: Date.now()},
    user: {type: Object, ref: 'User'},
    parent: {type: Object, ref: 'File'},
    childs: [{type: Object, ref: 'File'}]
});

module.exports = model('File', File);