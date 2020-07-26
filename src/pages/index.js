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
import Link from 'next/link'

import { refreshData } from '../api/refreshData'
import { getTopActive } from '../api/getTopActive'
import { getTopBest } from '../api/getTopBest'
import { getWorldwide } from '../api/getWorldwide'
import { getAllCountries } from '../api/getAllCountries'
import { percentageChange, formatNumber } from '../utils'

import { Wrapper, Chart } from '../components'

import ActiveIcon from '../images/cases.svg'
import CasesIcon from '../images/critical.svg'
import DeathsIcon from '../images/deaths.svg'
import RecoveredIcon from '../images/recovered.svg'

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

function Index ({ top, world, all }) {
  const [activeSet, setActiveSet] = useState('active')
  const [period, setPeriod] = useState(30)
  const theme = useTheme()

  const { thirtyDaysAgo, today, change } = world

  const periodSet = [
    {
      length: 30,
      label: '30 Days',
    },
    {
      length: world.data.stats.length,
      label: 'All Time',
    }
  ]

  return (
    <Wrapper allCountries={all}>
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
                    <StatNumber fontSize="2xl" fontWeight="700">{formatNumber(today[set.id])}</StatNumber>
                  </Box>
                  <Box width={1 / 2} textAlign="right">
                    <StatHelpText>{change[set.id]}</StatHelpText>
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
          data={world.data.stats}
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
          {top.active.map(country => (
            <Flex
              key={country.iso}
              p={4}
              borderBottom="1px solid"
              borderColor="gray.100"
            >
              <Box width={1 / 6}>
                <Link href={`/${kebabCase(country.name)}`}>
                  <a>
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
                  </a>
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
                    <Link href={`/${kebabCase(country.name)}`}>
                      <Button
                        variant="outline"
                        rightIcon="chevron-right"
                        size="xs"
                        as="a"
                        cursor="pointer"
                      >
                        Open
                      </Button>
                    </Link>
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
          {top.best.map(country => (
            <Flex
              key={country.iso}
              p={4}
              borderBottom="1px solid"
              borderColor="gray.100"
            >
              <Box width={1 / 6}>
                <Link href={`/${kebabCase(country.name)}`}>
                  <a>
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
                  </a>
                </Link>
              </Box>
              <Box width={1 / 6}>
                <Flex alignItems="center">
                  <Text
                    fontWeight={600}
                    color="gray.600"
                  >
                    {formatNumber(country.stats[1].active)}
                  </Text>
                  <Badge ml={2} variantColor="green">{parseFloat(country.change).toFixed(2)} %</Badge>
                </Flex>
              </Box>
              <Box width={1 / 6}>
                <Text
                  color="gray.500"
                >
                  {formatNumber(country.stats[1].deaths)}
                </Text>
              </Box>
              <Box width={1 / 6}>
                <Text
                  color="gray.500"
                >
                  {formatNumber(country.stats[1].critical)}
                </Text>
              </Box>
              <Box width={1 / 6}>
                <Text
                  color="gray.500"
                >
                  {formatNumber(country.stats[1].recovered)}
                </Text>
              </Box>
              <Box width={1 / 6}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text
                    color="teal.500"
                  >
                    {formatNumber(country.stats[1].cases)}
                  </Text>
                  <Box>
                    <Link href="/">
                      <Button
                        variant="outline"
                        rightIcon="chevron-right"
                        size="xs"
                        as="a"
                        cursor="pointer"
                      >
                        Open
                      </Button>
                    </Link>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>
    </Wrapper>
  )
}

export async function getStaticProps () {
  await refreshData()
  const worldData = await getWorldwide()
  const allCountries = await getAllCountries()

  const last = worldData.stats[worldData.stats.length - 30]
  const first = worldData.stats[worldData.stats.length - 1]

  return {
    props: {
      top: {
        ...await getTopActive(),
        ...await getTopBest()
      },
      world: {
        data: worldData,
        thirtyDaysAgo: last,
        today: first,
        change: {
          active: percentageChange(last.active, first.active),
          cases: percentageChange(last.cases, first.cases),
          deaths: percentageChange(last.deaths, first.deaths),
          recovered: percentageChange(last.recovered, first.recovered)
        }
      },
      all: allCountries.map(entry => ({
        name: entry.name,
        flag: entry.flag || '',
        iso: entry.iso || ''
      }))
    }
  }
}

export default Index
