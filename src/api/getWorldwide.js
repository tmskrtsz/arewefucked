const { Country } = require('./db')

exports.getWorldwide = async () => {
  const worldwide = await Country.find({
    name: { $eq: 'worldwide' }
  })

  return worldwide.map(entry => ({
    stats: entry.stats
  }))[0]
}
