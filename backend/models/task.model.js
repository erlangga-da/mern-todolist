const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    description: {type:String, required: true},
    file: {type:String, required: false},
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;