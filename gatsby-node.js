const path = require('path')
const isNull = require('lodash/isNull')
const isToday = require('date-fns/isToday')
const format = require('date-fns/format')
const kebabCase = require('lodash/kebabCase')
const chalk = require('chalk')
const orderBy = require('lodash/orderBy')

const { Country } = require('./src/api/db')
const { get } = require('./src/api/get')

exports.onPreInit = async () => {
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

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  const all = await get('https://corona.lmao.ninja/v2/countries')

  const formatted = all.map(entry => ({
    name: entry.country,
    stats: {
      cases: entry.cases,
      deaths: entry.deaths,
      critical: entry.critical,
      recovered: entry.recovered,
    },
    iso: entry.countryInfo.iso2
      ? entry.countryInfo.iso2.toLowerCase()
      : entry.countryInfo.iso2
  }))
    .filter(entity => !isNull(entity.iso))

  const top20 = {
    countries: orderBy(formatted, ['stats.cases'], ['desc']).slice(0, 20)
  }

  const nodeMeta = {
    id: createNodeId('top20'),
    parent: null,
    children: [],
    internal: {
      type: 'Top20',
      mediaType: 'application/javascript',
      content: JSON.stringify(top20),
      contentDigest: createContentDigest(top20)
    }
  }

  const node = { ...top20, ...nodeMeta }
  createNode(node)
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

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-apexcharts/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
