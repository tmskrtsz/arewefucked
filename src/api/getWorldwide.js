import { Country } from './db'

export async function getWorldwide () {
  const worldwide = await Country.find({
    name: { $eq: 'worldwide' }
  })

  return worldwide.map(entry => ({
    stats: entry.stats
  }))[0]
}
