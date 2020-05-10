require('dotenv')
  .config({ path: '.env' })
const mongoose = require('mongoose')
const chalk = require('chalk')

mongoose.connect(`${process.env.ATLAS_URI}/covid?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => console.log(`${chalk.green('success')} connected to MongoDB at ${ process.env.ATLAS_URI }`))
  .catch(e => console.warn(`Connection to MongoDB close: ${ e }`))

const Country = mongoose.model(
  'Country',
  {
    name: 'String',
    stats: [],
    metadata: {
      flag: 'String',
      name: 'String',
      iso: 'String'
    }
  }
)

module.exports = { Country }
