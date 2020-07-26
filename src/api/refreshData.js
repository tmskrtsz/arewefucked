import isNull from 'lodash/isNull'
import isToday from 'date-fns/isToday'
import format from 'date-fns/format'
import chalk from 'chalk'

import { Country } from './db'
import { get } from './get'

export async function refreshData () {
  // Check if the value from the database is current
  const isDataFromToday = await Country.findOne({
    name: 'worldwide'
  })

  const { updated: time } = isDataFromToday.stats[isDataFromToday.stats.length - 1]

  if (isToday(time)) {
    return
  }

  const data = [
    ...(await get('https://corona.lmao.ninja/v2/countries')),
    {
      ...(await get('https://corona.lmao.ninja/v2/all')),
      country: 'worldwide',
      countryInfo: { iso2: 'worldwide' }
    }
  ]

  await data.forEach(async country => {
    // Pull the data out
    const {
      country: countryName,
      countryInfo: { iso2 },
      cases,
      todayCases,
      deaths,
      todayDeaths,
      recovered,
      active,
      critical,
      casesPerOneMillion,
      deathsPerOneMillion,
      updated
    } = country

    const countryNameISO = !isNull(iso2) && iso2.trim()

    if (!countryNameISO || !countryName) return

    // Get data from mongo
    const res = await Country.findOne({
      name: countryName
    })

    if (!res) {
      console.log(`No data returned for ${ countryName }. \ Creating new entry.`)

      const entry = new Country({
        name: countryName,
        stats: [{
          cases,
          todayCases,
          deaths,
          todayDeaths,
          recovered,
          active,
          critical,
          casesPerOneMillion,
          deathsPerOneMillion,
          updated
        }],
        metadata: {
          iso: countryNameISO
        }
      })

      entry.save(err => {
        if (err) {
          console.error(err)
          return
        }
        console.log(`Created new entry for ${ countryName }`)
      })
      return
    }

    const lastEntry = res.stats[res.stats.length - 1]

    if (isToday(lastEntry.updated)) {
      return
    }

    await Country.findOneAndUpdate({ name: countryName }, {
      stats: [
        ...res.stats,
        {
          cases,
          todayCases,
          deaths,
          todayDeaths,
          recovered,
          active,
          critical,
          casesPerOneMillion,
          deathsPerOneMillion,
          updated
        }
      ]
    })

    console.log(`New record updated: \
      ${ chalk.green(countryName) }, \
      at ${ chalk.cyan(format(new Date(updated), 'eeee do, hh:mm:ss')) }`)
  })
}
