import { Country } from './db'

export async function getTopActive() {
  const res = await Country.find({
    name: { $not: { $eq: 'worldwide' } }
  },
  { stats: { $slice: -1 }, name: 1, metadata: 1 },
  {
    sort: { 'stats.active': -1 },
    limit: 20,
  })

  const sorted = res.sort((a, b) => b.stats[0].active - a.stats[0].active)

  const active = sorted.map(entry => ({
    name: entry.name,
    iso: entry.metadata.iso.toLowerCase(),
    stats: entry.stats[0],
  }))

  return { active }
}
