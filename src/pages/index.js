import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { format } from 'date-fns'
import { GatsbySeo } from 'gatsby-plugin-next-seo'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'

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
  TableHeader,
  TableBody,
  TableRow,
  StatsBox,
  Change
} from '../components'
import { formatNumber, percentageChange } from '../utils'

import casesIcon from '../images/cases.svg'
import deathsIcon from '../images/deaths.svg'
import criticalIcon from '../images/critical.svg'
import recoveredIcon from '../images/recovered.svg'


export default () => {
  const [activeSet, setActiveSet] = useState('active')
  const [period, setPeriod] = useState(30)
  const [change, setChange] = useState({})

  const {
    mongodbCovidCountries: data,
    allTop20: { nodes: top20 },
    allBestTop20: { nodes: topBest20 }
  } = useStaticQuery(query)
  const { stats } = data

  const last = stats[stats.length - 1]
  const first = stats[stats.length - 30]

  const dataSets = [
    'active',
    'cases',
    'deaths',
    'critical',
    'recovered'
  ]

  useEffect(() => {
    setChange({
      active: percentageChange(last.active, first.active),
      cases: percentageChange(last.cases, first.cases),
      deaths: percentageChange(last.deaths, first.deaths),
      recovered: percentageChange(last.recovered, first.recovered)
    })
  }, [last, first])

  return (
    <>
      <GatsbySeo
        title="Worldwide Statistics"
        description="COVID-19 statistics based on the last 30 days of data"
      />
      <Hero>
        <Flex
          justifyContent="center"
          alignItems="center"
        >
          <h6><Change criteria="negative">{change.active}</Change></h6>
          <Box ml={2}>
            <h4>increase in world active cases since {format(first.updated, 'MMMM, do')}</h4>
          </Box>
        </Flex>
        <Box width={1} py={3}>
          <h1>Yes, We’re Fucked</h1>
        </Box>
        <Box width={1}>
          <h3>Stay Home</h3>
        </Box>
      </Hero>
      <Flex
        alignItems="center"
        py={4}
      >
        <Heading as="h3">Total Statistics</Heading>
        <Box ml={2}>
          <Heading as="h5" muted>(Last 30 Days)</Heading>
        </Box>
      </Flex>
      <Flex flexWrap="wrap" mx={-3}>
        <Box width={[1 / 4]}>
          <StatsBox
            icon={criticalIcon}
            label="Active"
            stats={{
              absolute: last.active,
              change: change.active || '',
              changeCriteria: 'negative'
            }}
            mx={3}
            p={4}
            pt={0}
          />
        </Box>
        <Box width={[1 / 4]}>
          <StatsBox
            icon={casesIcon}
            label="Confirmed Cases"
            stats={{
              absolute: last.cases,
              change: change.cases || '',
              changeCriteria: 'negative'
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
              change: change.deaths || '',
              changeCriteria: 'negative'
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
              change: change.recovered || '',
              changeCriteria: 'positive'
            }}
            mx={3}
            p={4}
            pt={0}
          />
        </Box>
      </Flex>
      <Flex mt={4}>
        <Box width={1 / 2}>
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
        </Box>
        <Box width={1 / 2}>
          <Flex justifyContent="flex-end">
            <Box mr={2}>
              <Button
                type="button"
                onClick={() => setPeriod(30)}
                as={period !== 30 ? Secondary : Button}
              >
                30 Days
              </Button>
            </Box>
            <Button
              type="button"
              onClick={() => setPeriod(stats.length)}
              as={period !== stats.length ? Secondary : Button}
            >
              All Time
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Chart
        data={stats}
        dataSet={activeSet}
        period={period}
      />
      <Flex
        flexDirection="column"
        py={4}
      >
        <Flex
          alignItems="center"
          py={4}
        >
          <Heading as="h3">Top 20 Active Cases</Heading>
          <Box ml={2}>
            <Heading as="h5" muted>(24 Hours)</Heading>
          </Box>
        </Flex>
        <Table
          header={['Country', 'Active', 'Deaths', 'Critical', 'Recovered', 'Total']}
          items={top20[0].countries}
        />
      </Flex>
      <Flex
        flexDirection="column"
        py={4}
      >
        <Flex pb={4} alignItems="center">
          <Heading as="h3">Top 20 Best Performing</Heading>
          <Box ml={2}>
            <Heading as="h5" muted>(last 30 days)</Heading>
          </Box>
        </Flex>
        <TableHeader
          py={2}
          px={3}
          justifyContent="space-between"
        >
          <Box width={1 / 6}>
            <span>Country</span>
          </Box>
          <Box width={1 / 6}>
            <span>Active</span>
          </Box>
          <Box width={1 / 6}>
            <span>Change</span>
          </Box>
          <Box width={1 / 6}>
            <span>Cases</span>
          </Box>
          <Box width={1 / 6}>
            <span>Recovered</span>
          </Box>
          <Box width={1 / 6}>
            <span>Deaths</span>
          </Box>
        </TableHeader>
        <TableBody flexDirection="column">
          {topBest20[0].countries.map(entry => (
            <TableRow
              key={entry.name}
              py={3}
              px={3}
              alignItems="center"
            >
              <Box width={1 / 6}>
                <Link to={`/${kebabCase(entry.name)}`}>
                  <Flex alignItems="center">
                    <img
                      src={`https://www.countryflags.io/${ entry.iso }/shiny/64.png`}
                      alt={`Flag of ${entry.name}`}
                    />
                    <strong>{entry.name}</strong>
                  </Flex>
                </Link>
              </Box>
              <Box width={[1 / 6]}>
                <strong>{formatNumber(entry.stats[1].active)}</strong>
              </Box>
              <Box width={[1 / 6]}>
                <Change criteria="positive">{entry.change}</Change>
              </Box>
              <Box width={[1 / 6]}>
                {formatNumber(entry.stats[1].cases)}
              </Box>
              <Box width={[1 / 6]}>
                {formatNumber(entry.stats[1].recovered)}
              </Box>
              <Box width={[1 / 6]}>
                <Flex justifyContent="space-between" alignItems="center">
                  {formatNumber(entry.stats[1].deaths)}
                  <Secondary as={Link} to={`/${kebabCase(entry.name)}`}>
                    More Stats
                  </Secondary>
                </Flex>
              </Box>
            </TableRow>
          ))}
        </TableBody>
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
          active
          critical
          deaths
          recovered
        }
      }
    }
  }

  allBestTop20 {
    nodes {
      countries {
        iso
        name
        change
        stats {
          active
          cases
          deaths
          recovered
        }
      }
    }
  }

}`
