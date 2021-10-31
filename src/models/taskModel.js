const mongoose = require('../database/mongoConnection')
const { v4: uuidv4 } = require('uuid'); 

const taskSchema = mongoose.Schema(
    {
        _id: {type: String, alias: "UUID", default: () => uuidv4()},
        title: {type: String, required: true},
        taskListNumber: {type: mongoose.Schema.Types.Number, required: true},
        completed: {type: mongoose.Schema.Types.Boolean, default: false}
    },
    {
        versionKey: false
    }
)

const Task = mongoose.model('Task', taskSchema)

module.exports = Task