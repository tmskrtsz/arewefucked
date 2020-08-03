import React, { useState } from 'react'
import {
  Flex,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Button,
  Heading,
  Text,
  Image,
  useTheme
} from '@chakra-ui/core'
import kebabCase from 'lodash/kebabCase'
import { Link, graphql, useStaticQuery } from 'gatsby'
import { GatsbySeo } from 'gatsby-plugin-next-seo'

import { formatNumber } from '../utils'
import { Wrapper, Chart } from '../components'

import ActiveIcon from '../images/svg-components/cases.svg'
import CasesIcon from '../images/svg-components/critical.svg'
import DeathsIcon from '../images/svg-components/deaths.svg'
import RecoveredIcon from '../images/svg-components/recovered.svg'

export const dataSets = [
  {
    id: 'active',
    label: 'Active',
    icon: <ActiveIcon />,
  },
  {
    id: 'cases',
    label: 'Confirmed Cases',
    icon: <CasesIcon />,
  },
  {
    id: 'deaths',
    label: 'Deaths',
    icon: <DeathsIcon />,
  },
  {
    id: 'critical',
    label: 'Critical',
    icon: '',
  },
  {
    id: 'recovered',
    label: 'Recovered',
    icon: <RecoveredIcon />,
  }
]

function Index () {
  const {
    world,
    activeTop20: { active },
    bestTop20: { best },
    monthToDate
  } = useStaticQuery(query)

  const [activeSet, setActiveSet] = useState('active')
  const [period, setPeriod] = useState(30)
  const theme = useTheme()

  const periodSet = [
    {
      length: 30,
      label: '30 Days',
    },
    {
      length: world.stats.length,
      label: 'All Time',
    }
  ]

  return (
    <>
      <GatsbySeo
        title="Worldwide COVID-19 Statistics"
        description="COVID-19 statistics based on the last 30 days of data"
        openGraph={{
          title: 'Worldwide COVID-19 Statistics',
          description: 'COVID-19 statistics based on the last 30 days of data'
        }}
      />
      <Wrapper>
        <Flex flexWrap="wrap">
          {dataSets.filter(set => set.id !== 'critical')
            .map(set => (
              <Box
                key={set.id}
                width={1 / 4}
              >
                <Stat
                  bg="#fff"
                  borderWidth="1px"
                  borderColor="gray.300"
                  m={2}
                  p={4}
                  rounded="md"
                  shadow={theme.shadows.md}
                >
                  {set.icon}
                  <Flex
                    alignItems="flex-end"
                    mt={32}
                  >
                    <Box width={1 / 2}>
                      <StatLabel mb={1}>
                        <Badge as="span" variantColor="purple" variant="subtle">{set.label}</Badge>
                      </StatLabel>
                      <StatNumber fontSize="2xl" fontWeight="700">{formatNumber(monthToDate.today[set.id])}</StatNumber>
                    </Box>
                    <Box width={1 / 2} textAlign="right">
                      <StatHelpText>{monthToDate.change[set.id]}</StatHelpText>
                    </Box>
                  </Flex>
                </Stat>
              </Box>
            ))
          }
        </Flex>
        <Box
          w={1180}
          my={12}
        >
          <Flex>
            <Box width={2 / 3}>
              <Flex>
                {dataSets.map(set => (
                  <Button
                    key={set.id}
                    variantColor="blue"
                    variant={activeSet === set.id ? 'solid' : 'outline'}
                    size="sm"
                    mr={2}
                    onClick={() => setActiveSet(set.id)}
                  >
                    {set.label}
                  </Button>
                ))}
              </Flex>
            </Box>
            <Box width={1 / 3}>
              <Flex justifyContent="flex-end">
                {periodSet.map(set => (
                  <Box
                    key={set.label}
                    ml={2}
                  >
                    <Button
                      variantColor="gray"
                      variant={period === set.length ? 'solid' : 'outline'}
                      size="sm"
                      onClick={() => setPeriod(set.length)}
                    >
                      {set.label}
                    </Button>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
          <Chart
            data={world.stats}
            dataSet={activeSet}
            period={period}
          />
        </Box>
        <Box my={2}>
          <Heading as="h2" size="lg">Most Active Cases <Badge variantColor="red">30 Days</Badge></Heading>
        </Box>
        <Box
          my={8}
          bg="#fff"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Flex
            p={4}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            {['Country', 'Active', 'Deaths', 'Critical', 'Recovered', 'Total'].map(column => (
              <Box
                key={column}
                width={1 / 6}
              >
                <Text
                  fontWeight="600"
                  color="gray.400"
                  textTransform="uppercase"
                  fontSize="sm"
                  letterSpacing="1px"
                >
                  {column}
                </Text>
              </Box>
            ))}
          </Flex>
          <Box>
            {active.map(country => (
              <Flex
                key={country.iso}
                p={4}
                borderBottom="1px solid"
                borderColor="gray.100"
              >
                <Box width={1 / 6}>
                  <Link to={`/${kebabCase(country.name)}`}>
                    <Flex alignItems="center">
                      <Box mr={2}>
                        <Image
                          src={`https://www.countryflags.io/${ country.iso }/shiny/64.png`}
                          alt={`Flag of ${country.name}`}
                          size="32px"
                        />
                      </Box>
                      <Text
                        fontWeight={600}
                      >
                        {country.name}
                      </Text>
                    </Flex>
                  </Link>
                </Box>
                <Box width={1 / 6}>
                  <Text
                    fontWeight={600}
                    color="gray.600"
                  >
                    {formatNumber(country.stats.active)}
                  </Text>
                </Box>
                <Box width={1 / 6}>
                  <Text
                    color="gray.500"
                  >
                    {formatNumber(country.stats.deaths)}
                  </Text>
                </Box>
                <Box width={1 / 6}>
                  <Text
                    color="gray.500"
                  >
                    {formatNumber(country.stats.critical)}
                  </Text>
                </Box>
                <Box width={1 / 6}>
                  <Text
                    color="gray.500"
                  >
                    {formatNumber(country.stats.recovered)}
                  </Text>
                </Box>
                <Box width={1 / 6}>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text
                      color="teal.500"
                    >
                      {formatNumber(country.stats.cases)}
                    </Text>
                    <Box>
                      <Button
                        as={Link}
                        to={`/${kebabCase(country.name)}`}
                        variant="outline"
                        rightIcon="chevron-right"
                        size="xs"
                        cursor="pointer"
                      >
                        Open
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
        <Box my={2}>
          <Heading as="h2" size="lg">Fewest Cases <Badge variantColor="green">30 Days</Badge></Heading>
        </Box>
        <Box
          my={8}
          bg="#fff"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Flex
            p={4}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            {['Country', 'Active', 'Deaths', 'Critical', 'Recovered', 'Total'].map(column => (
              <Box
                key={column}
                width={1 / 6}
              >
                <Text
                  fontWeight="600"
                  color="gray.400"
                  textTransform="uppercase"
                  fontSize="sm"
                  letterSpacing="1px"
                >
                  {column}
                </Text>
              </Box>
            ))}
          </Flex>
          <Box>
            {best.map(country => (
              <Flex
                key={country.iso}
                p={4}
                borderBottom="1px solid"
                borderColor="gray.100"
              >
                <Box width={1 / 6}>
                  <Link to={`/${kebabCase(country.name)}`}>
                    <Flex alignItems="center">
                      <Box mr={2}>
                        <Image
                          src={`https://www.countryflags.io/${ country.iso }/shiny/64.png`}
                          alt={`Flag of ${country.name}`}
                          size="32px"
                        />
                      </Box>
                      <Text
                        fontWeight={600}
                      >
                        {country.name}
                      </Text>
                    </Flex>
                  </Link>
                </Box>
                <Box width={1 / 6}>
                  <Flex alignItems="center">
                    <Text
                      fontWeight={600}
                      color="gray.600"
                    >
                      {formatNumber(country.stats.today.active)}
                    </Text>
                    <Badge ml={2} variantColor="green">{parseFloat(country.change).toFixed(2)} %</Badge>
                  </Flex>
                </Box>
                <Box width={1 / 6}>
                  <Text
                    color="gray.500"
                  >
                    {formatNumber(country.stats.today.deaths)}
                  </Text>
                </Box>
                <Box width={1 / 6}>
                  <Text
                    color="gray.500"
                  >
                    {formatNumber(country.stats.today.critical)}
                  </Text>
                </Box>
                <Box width={1 / 6}>
                  <Text
                    color="gray.500"
                  >
                    {formatNumber(country.stats.today.recovered)}
                  </Text>
                </Box>
                <Box width={1 / 6}>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text
                      color="teal.500"
                    >
                      {formatNumber(country.stats.today.cases)}
                    </Text>
                    <Box>
                      <Button
                        as={Link}
                        to={`/${kebabCase(country.name)}`}
                        variant="outline"
                        rightIcon="chevron-right"
                        size="xs"
                        cursor="pointer"
                      >
                        Open
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
      </Wrapper>
    </>
  )
}


export const query = graphql`
  query {
    world: mongodbCovidCountries(name: {eq: "worldwide"}) {
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
  activeTop20 {
    active {
      iso
      name
      stats {
        active
        critical
        cases
        deaths
        recovered
      }
    }
  }
  bestTop20 {
    best {
      name
      iso
      change
      stats {
        monthTodate {
          active
          cases
          deaths
          recovered
        }
        today {
          active
          cases
          deaths
          recovered
          critical
        }
      }
    }
  }
  monthToDate {
    change {
      active
      deaths
      cases
      recovered
    }
    monthAgo {
      active
      cases
      deaths
      recovered
    }
    today {
      active
      cases
      deaths
      recovered
    }
  }
}`

export default Index
