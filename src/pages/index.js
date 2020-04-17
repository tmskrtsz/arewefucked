import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { Layout } from '../templates'
import { Hero, Container, Flex, Box, Label, Heading, Chart, Button, Secondary, Table } from '../components'
import { formatNumber, percentageChange } from '../utils'

export default () => {
  const [top, setTop] = useState([])
  const [activeSet, setActiveSet] = useState('cases')
  const { mongodbCovidCountries: data, all } = useStaticQuery(query)
  const { stats } = data

  const last = stats[stats.length - 1]
  const beforeLast = stats[stats.length - 2]

  const dataSets = [
    'cases',
    'deaths',
    'critical',
    'recovered'
  ]

  useEffect(() => {
    setTop(all.nodes.map(entry => ({
      name: entry.name,
      stats: entry.stats.pop(),
      flag: entry.metadata && entry.metadata.flag
    }))
      .sort((a, b) => a.stats && a.stats.cases < b.stats && b.stats.cases)
      .filter(entry => entry.name !== 'worldwide')
      .slice(0, 20)
    )
  }, [all])

  console.log(stats)
  return (
    <Layout>
      <Hero>
        <h4>25% increase in world cases</h4>
        <h1>Yes, We’re Fucked</h1>
        <h3>Stay Home</h3>
      </Hero>
      <Flex flexWrap="wrap" mx={-3}>
        <Box width={[1 / 4]}>
          <Container
            mx={3}
            p={4}
            pt={0}
          >
            <Label>Confirmed Cases</Label>
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Box>
                <Heading as="h2">{formatNumber(last.cases)}</Heading>
              </Box>
              <Box>
                <span>{percentageChange(last.cases, beforeLast.cases)}</span>
              </Box>
            </Flex>
          </Container>
        </Box>
        <Box width={[1 / 4]}>
          <Container
            mx={3}
            p={4}
            pt={0}
          >
            <Label>Deaths</Label>
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading as="h2">{formatNumber(last.deaths)}</Heading>
              <span>{percentageChange(last.deaths, beforeLast.deaths)}</span>
            </Flex>
          </Container>
        </Box>
        <Box width={[1 / 4]}>
          <Container
            mx={3}
            p={4}
            pt={0}
          >
            <Label>Critical</Label>
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading as="h2">{formatNumber(last.critical)}</Heading>
              <span>{percentageChange(last.critical, beforeLast.critical)}</span>
            </Flex>
          </Container>
        </Box>
        <Box width={[1 / 4]}>
          <Container
            mx={3}
            p={4}
            pt={0}
          >
            <Label>Recovered</Label>
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading as="h2">{formatNumber(last.recovered)}</Heading>
              <span>{percentageChange(last.recovered, beforeLast.recovered)}</span>
            </Flex>
          </Container>
        </Box>
      </Flex>
      <Flex my={4}>
        <Box width={1}>
          <div>
            {dataSets.map(dataSet => (
              dataSet === activeSet
                ? (
                  <Button
                    type="button"
                    onClick={() => setActiveSet(dataSet)}
                  >
                    {dataSet}
                  </Button>
                )
                : (
                  <Secondary
                    type="button"
                    onClick={() => setActiveSet(dataSet)}
                  >
                    {dataSet}
                  </Secondary>
                )
            ))}
          </div>
          <Chart data={stats} dataSet={activeSet} />
        </Box>
      </Flex>
      <Flex flexWrap="wrap" flexDirection="column">
        <Flex alignItems="center">
          <Heading as="h3">Top Statistics</Heading>
          <Heading
            as="span"
            css={`
            font-size: 2rem;
            margin-left: 0.5em;
            opacity: 0.4;
          `}
          >
            (30 Days)
          </Heading>
        </Flex>
        <Table
          header={['Country', 'Cases', 'Deaths', 'Critical', 'Recovered']}
          items={top}
        />
      </Flex>
    </Layout>
  )
}

export const query = graphql`
  query {
    mongodbCovidCountries(name: {eq: "worldwide"}) {
    mongodb_id
    name
    stats {
      updated
      active
      affectedCountries
      cases
      casesPerOneMillion
      critical
      deaths
      deathsPerOneMillion
      tests
      recovered
      testsPerOneMillion
      todayCases
      todayDeaths
    }
  }

  all: allMongodbCovidCountries {
    nodes {
      name
      metadata {
        flag
      }
      stats {
        cases
        deaths
        critical
        recovered
      }
    }
  }
}`
