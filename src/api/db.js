require('dotenv').config({
  path: '.env',
})
const mongoose = require('mongoose')
const chalk = require('chalk')

const { Schema } = mongoose

mongoose.connect(`${process.env.ATLAS_URI}/covid`)
  .then(() => console.log(`${chalk.green('success')} connected to MongoDB at ${ process.env.ATLAS_URI }`))
  .catch(e => console.warn(`Connection to MongoDB close: ${ e }`))

const countrySchema = Schema({
  name: 'String',
  stats: [],
  metadata: {
    flag: 'String',
    name: 'String',
    iso: 'String'
  }
})

const Country = mongoose.model(
  'Country',
  countrySchema
)

module.exports = { Country }
