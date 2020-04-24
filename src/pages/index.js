import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { Hero, Container, Flex, Box, Label, Heading, Chart, Button, Secondary, Table } from '../components'
import { formatNumber, percentageChange } from '../utils'

export default () => {
  const [activeSet, setActiveSet] = useState('cases')
  const [change, setChange] = useState({})
  const {
    mongodbCovidCountries: data,
    allTop20: { nodes: top20 }
  } = useStaticQuery(query)
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
    setChange({
      cases: percentageChange(last.cases, beforeLast.cases),
      deaths: percentageChange(last.deaths, beforeLast.deaths),
      critical: percentageChange(last.critical, beforeLast.critical),
      recovered: percentageChange(last.recovered, beforeLast.recovered)
    })
  }, [last, beforeLast])

  return (
    <>
      <Hero>
        <h4>{change.cases} increase in world cases</h4>
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
                <span>{change.cases}</span>
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
              <span>{change.deaths}</span>
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
              <span>{change.critical}</span>
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
              <span>{change.recovered}</span>
            </Flex>
          </Container>
        </Box>
      </Flex>
      <Flex my={4}>
        <Box width={1}>
          <Flex>
            {dataSets.map(dataSet => (
              dataSet === activeSet
                ? (
                  <Box
                    key={dataSet}
                    mr={2}
                  >
                    <Button
                      type="button"
                      onClick={() => setActiveSet(dataSet)}
                    >
                      {dataSet}
                    </Button>
                  </Box>
                )
                : (
                  <Box
                    key={dataSet}
                    mr={2}
                  >
                    <Secondary
                      type="button"
                      onClick={() => setActiveSet(dataSet)}
                    >
                      {dataSet}
                    </Secondary>
                  </Box>
                )
            ))}
          </Flex>
          <Chart data={stats} dataSet={activeSet} />
        </Box>
      </Flex>
      <Flex flexWrap="wrap" flexDirection="column">
        <Flex alignItems="center">
          <Heading as="h3">Worldwide Statistics</Heading>
          <Heading
            as="span"
            css={`
            font-size: 2rem;
            margin-left: 0.5em;
            opacity: 0.4;
          `}
          >
            (24 Hours)
          </Heading>
        </Flex>
        <Table
          header={['Country', 'Cases', 'Deaths', 'Critical', 'Recovered']}
          items={top20[0].countries}
        />
      </Flex>
    </>
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

  allTop20 {
    nodes {
      countries {
        iso
        name
        stats {
          cases
          critical
          deaths
          recovered
        }
      }
    }
  }
}`
