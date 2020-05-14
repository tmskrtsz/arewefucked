import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import {
  Hero,
  Container,
  Flex,
  Box,
  Label,
  Heading,
  Chart,
  Button,
  Secondary,
  Table,
  StatsBox
} from '../components'
import { formatNumber, percentageChange } from '../utils'

import casesIcon from '../images/cases.svg'
import deathsIcon from '../images/deaths.svg'
import criticalIcon from '../images/critical.svg'
import recoveredIcon from '../images/recovered.svg'

export default () => {
  const [activeSet, setActiveSet] = useState('cases')
  const [change, setChange] = useState({})
  const {
    mongodbCovidCountries: data,
    allTop20: { nodes: top20 }
  } = useStaticQuery(query)
  const { stats } = data

  const last = stats[stats.length - 1]
  const first = stats[stats.length - 30]

  const dataSets = [
    'cases',
    'deaths',
    'critical',
    'recovered'
  ]

  useEffect(() => {
    setChange({
      cases: percentageChange(last.cases, first.cases),
      deaths: percentageChange(last.deaths, first.deaths),
      critical: percentageChange(last.critical, first.critical),
      recovered: percentageChange(last.recovered, first.recovered)
    })
  }, [last, first])


  return (
    <>
      <Hero>
        <h4>{change.cases} increase in world cases</h4>
        <h1>Yes, We’re Fucked</h1>
        <h3>Stay Home</h3>
      </Hero>
      <Flex alignItems="center">
        <Heading as="h3">Total Statistics</Heading>
        <Heading as="span" muted>(Last 30 Days)</Heading>
      </Flex>
      <Flex flexWrap="wrap" mx={-3}>
        <Box width={[1 / 4]}>
          <StatsBox
            icon={casesIcon}
            label="Confirmed Cases"
            stats={{
              absolute: last.cases,
              change: change.cases || ''
            }}
            mx={3}
            p={4}
            pt={0}
          />
        </Box>
        <Box width={[1 / 4]}>
          <StatsBox
            icon={deathsIcon}
            label="Deaths"
            stats={{
              absolute: last.deaths,
              change: change.deaths || ''
            }}
            mx={3}
            p={4}
            pt={0}
          />
        </Box>
        <Box width={[1 / 4]}>
          <StatsBox
            icon={criticalIcon}
            label="Critical"
            stats={{
              absolute: last.critical,
              change: change.critical || ''
            }}
            mx={3}
            p={4}
            pt={0}
          />
        </Box>
        <Box width={[1 / 4]}>
          <StatsBox
            icon={recoveredIcon}
            label="Recovered"
            stats={{
              absolute: last.recovered,
              change: change.recovered || ''
            }}
            mx={3}
            p={4}
            pt={0}
          />
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
            muted
            as="span"
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
