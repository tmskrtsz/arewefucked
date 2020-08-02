const { Country } = require('./db')

exports.getTopBest = async () => {
  const res = await Country.find({
    name: { $not: { $eq: 'worldwide' } }
  },
  { stats: { $slice: -30 }, name: 1, metadata: 1 })

  const formatted = res.map(entry => ({
    name: entry.name,
    iso: entry.metadata.iso && entry.metadata.iso.toLowerCase(),
    stats: {
      monthTodate: { ...entry.stats[0] },
      today: { ...entry.stats[entry.stats.length - 1] }
    },
    change: (() => {
      const old = entry.stats[0].active
      const last = entry.stats[entry.stats.length - 1].active

      if (old === 0) return 0

      return (last - old) / old * 100
    })()
  }))

  const sorted = formatted.sort((a, b) => a.change - b.change)

  const best = sorted
    .filter(entry => entry.stats.today.cases > 1000)
    .map(entry =>({
      ...entry,
      stats: {
        ...entry.stats
      },
      change: entry.change.toFixed(3)
    }))
    .slice(0, 20)

  return { best }
}
