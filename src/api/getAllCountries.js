import { Country } from './db'

export async function getAllCountries () {
  const worldwide = await Country.find({
    name: { $nin: ['worldwide', 'Diamond Princess'] }
  })

  return worldwide.map(entry => ({
    name: entry.name,
    flag: entry.metadata.flag || '',
    iso: entry.metadata.iso,
    stats: entry.stats
  }))
}
