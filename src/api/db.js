import mongoose from 'mongoose'
import chalk from 'chalk'

const { Schema } = mongoose

mongoose.connect(`${process.env.ATLAS_URI}/covid?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
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

let Country

try {
  Country = mongoose.model('Country')
} catch {
  Country = mongoose.model('Country', countrySchema)
}

export { Country }
