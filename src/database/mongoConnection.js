const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/truenorth')
    .then(db => console.log('Connection Success', db))
    .catch(err => console.log(err))

module.exports = mongoose