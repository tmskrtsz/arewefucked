const path = require('path')
const kebabCase = require('lodash/kebabCase')

const { refreshData } = require('./src/api/refreshData')
const { getTopActive } = require('./src/api/getTopActive')
const { getTopBest } = require('./src/api/getTopBest')
const { getWorldwide } = require('./src/api/getWorldwide')
const { getAllCountries } = require('./src/api/getAllCountries')
const { createGQLNode } = require('./src/api/createGQLNode')
const { percentageChange } = require('./src/utils')

exports.onPreInit = async () => {
  await refreshData()
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const { createNode } = actions

  const context = {
    createNode,
    createNodeId,
    createContentDigest
  }

  const topActive = {
    label: 'activeTop20',
    name: 'ActiveTop20',
    payload: { ...await getTopActive() }
  }

  const topBest = {
    label: 'bestTop20',
    name: 'BestTop20',
    payload: { ...await getTopBest() }
  }

  createGQLNode(context, topActive)
  createGQLNode(context, topBest)

  const worldData = await getWorldwide()
  const last = worldData.stats[worldData.stats.length - 30]
  const first = worldData.stats[worldData.stats.length - 1]

  const monthToDate = {
    label: 'monthToDate',
    name: 'MonthToDate',
    payload: {
      monthAgo: last,
      today: first,
      change: {
        active: percentageChange(first.active, last.active),
        cases: percentageChange(first.cases, last.cases),
        deaths: percentageChange(first.deaths, last.deaths),
        recovered: percentageChange(first.recovered, last.recovered)
      }
    }
  }

  createGQLNode(context, monthToDate)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  return graphql(`
    {
      countries: allMongodbCovidCountries {
        edges {
          node {
            name
            mongodb_id
          }
        }
      }
    }`
  ).then(result => {
    // Create pages for country.
    result.data.countries.edges.forEach(({ node }) => {
      const name = kebabCase(node.name.trim().toLowerCase())
      const { mongodb_id: id } = node

      createPage({
        path: name,
        component: path.resolve('./src/templates/page.js'),
        context: { id },
      })
    })
  }).catch(err => {
    reporter.panicOnBuild(err)
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
