const path = require('path')
const isNull = require('lodash/isNull')
const isToday = require('date-fns/isToday')
const format = require('date-fns/format')
const kebabCase = require('lodash/kebabCase')
const chalk = require('chalk')

const { Country } = require('./src/api/db')
const { get } = require('./src/api/get')

exports.onPreInit = async () => {
  const data = [
    ...(await get('https://corona.lmao.ninja/countries')),
    {
      ...(await get('https://corona.lmao.ninja/all')),
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

    if (!countryNameISO) return

    // Get data from mongo
    const res = await Country.findOne({
      name: countryName
    })

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
      at ${ chalk.cyan(format(new Date(cases), 'eeee eo, hh:mm:ss')) }`)
  })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMongodbCovidCountries {
        edges {
          node {
            name
            stats {
              active
              affectedCountries
              cases
              casesPerOneMillion
              critical
              deaths
              deathsPerOneMillion
              recovered
              tests
              testsPerOneMillion
              todayCases
              todayDeaths
              updated
            }
            metadata {
              flag
              iso
            }
            mongodb_id
          }
        }
      }
    }`
  )

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }

  // Create pages for country.
  const pageTemplate = path.resolve('src/templates/page.js')
  result.data.allMongodbCovidCountries.edges.forEach(({ node }) => {
    const name = kebabCase(node.name.trim().toLowerCase())
    const { mongodb_id: id } = node

    createPage({
      path: name,
      component: pageTemplate,
      context: { id },
    })
  })

}
