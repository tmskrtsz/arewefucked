import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { Layout } from '../templates'
import { Hero, Container, Flex, Box, Label, Heading, Chart, Button, Secondary } from '../components'
import { formatNumber, percentageChange } from '../utils'

export default () => {
  const [activeSet, setActiveSet] = useState('cases')
  const { mongodbCovidCountries: data } = useStaticQuery(query)
  const { stats } = data

  const last = stats[stats.length - 1]
  const beforeLast = stats[stats.length - 2]

  const dataSets = [
    'cases',
    'deaths',
    'critical',
    'recovered'
  ]

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
}`
