const path = require('path')
const isNull = require('lodash/isNull')
const isToday = require('date-fns/isToday')
const format = require('date-fns/format')
const kebabCase = require('lodash/kebabCase')
const chalk = require('chalk')

const { Country } = require('./src/api/db')
const { get } = require('./src/api/get')

exports.onPreInit = async () => {
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

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions


  async function top20ByActiveCases () {
    const res = await Country.find({
      name: { $not: { $eq: 'worldwide' } }
    },
    { stats: { $slice: -1 }, name: 1, metadata: 1 },
    {
      sort: { 'stats.active': -1 },
      limit: 20,
    })

    const sorted = res.sort((a, b) => b.stats[0].active - a.stats[0].active)

    const countries = sorted.map(entry => ({
      name: entry.name,
      iso: entry.metadata.iso.toLowerCase(),
      stats: entry.stats[0],
    }))

    const top20 = { countries }

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

  async function bestPerfomingLast30Days () {
    const res = await Country.find({
      name: { $not: { $eq: 'worldwide' } }
    },
    { stats: { $slice: -30 }, name: 1, metadata: 1 })

    const formatted = res.map(entry => ({
      name: entry.name,
      iso: entry.metadata.iso && entry.metadata.iso.toLowerCase(),
      stats: [
        entry.stats[0],
        entry.stats[entry.stats.length - 1]
      ],
      change: (() => {
        const old = entry.stats[0].active
        const last = entry.stats[entry.stats.length - 1].active

        if (old === 0) return 0

        return (last - old) / old * 100
      })()
    }))

    const sorted = formatted.sort((a, b) => a.change - b.change)

    const bestTop20 = {
      countries: sorted
        .filter(entry => entry.stats[1].cases > 1000)
        .map(entry =>({
          ...entry,
          change: entry.change.toFixed(3)
        }))
        .slice(0, 20)
    }

    const nodeMeta = {
      id: createNodeId('bestTop20'),
      parent: null,
      children: [],
      internal: {
        type: 'BestTop20',
        mediaType: 'application/javascript',
        content: JSON.stringify(bestTop20),
        contentDigest: createContentDigest(bestTop20)
      }
    }

    const node = { ...bestTop20, ...nodeMeta }
    createNode(node)
  }

  await top20ByActiveCases()
  await bestPerfomingLast30Days()
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
