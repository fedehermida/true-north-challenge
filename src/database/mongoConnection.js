const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.MONGOHOST}:${process.env.MONGOPORT}/truenorth`)
    .then(db => console.log('Connection Success', db))
    .catch(err => console.log(err))

module.exports = mongoose