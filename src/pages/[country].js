import React, { useState } from 'react'
import kebabCase from 'lodash/kebabCase'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Badge,
  Flex,
  Box,
  Image,
  useTheme,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/core'
import Link from 'next/link'
import styled from '@emotion/styled'

import { getAllCountries } from '../api/getAllCountries'
import { Wrapper, Chart } from '../components'
import { percentageChange, formatNumber } from '../utils'
import { dataSets } from './'

const FlagBg = styled.div`
  width: 100%;
  height: 548px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;

  &::after {
    content: '';
    background-image: url(${ ({ bgFlag }) => bgFlag && bgFlag });
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(80px);
  }
`

function Country ({ data, today, all }) {
  const [activeSet, setActiveSet] = useState('active')
  const [period, setPeriod] = useState(30)
  const theme = useTheme()

  if (!data) return null
  const country = data

  const periodSet = [
    {
      length: 30,
      label: '30 Days',
    },
    {
      length: country.stats.length,
      label: 'All Time',
    }
  ]

  return (
    <Wrapper allCountries={all}>
      <Breadcrumb mb={24}>
        <BreadcrumbItem>
          <Link href="/">
            <BreadcrumbLink as="a">Home</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">{country.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex flexDirection="column">
        <Badge mr="auto">Last 24 Hours</Badge>
        <Heading as="h1" size="2xl">{country.name}</Heading>
      </Flex>
      <Flex
        my={12}
        zIndex={theme.zIndices.hide}
      >
        <Box w="100%" h="100%" borderRadius="2xl">
          <FlagBg bgFlag={country.flag} />
        </Box>
      </Flex>
      <Flex
        mt={-420}
        px={18}
        pb={24}
      >
        <Box
          bg="#fff"
          w="100%"
          border="1px solid"
          borderColor={theme.colors.gray[200]}
          zIndex={theme.zIndices.base}
          borderRadius={theme.radii.lg}
          p={8}
        >
          <Flex
            alignItems="center"
            mb={4}
          >
            <Box width={1 / 3}>
              <Image
                src={country.flag}
                alt={`Flag of ${country.name}`}
                w="64px"
                borderRadius={theme.radii.lg}
              />
            </Box>
            <Box width={2 / 3}>
              <Flex justifyContent="space-between">
                {dataSets.map(set => (
                  <Box key={set.id}>
                    <StatLabel>
                      <Badge as="span" variantColor="purple" variant="subtle">{set.label}</Badge>
                    </StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="700">{formatNumber(today[set.id])}</StatNumber>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
          <Heading as="h3" mb={4}>Statistics</Heading>
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
            data={data.stats}
            dataSet={activeSet}
            period={period}
          />
        </Box>
      </Flex>
    </Wrapper>
  )
}

export async function getStaticPaths () {
  const allCountries = await getAllCountries()
  const paths = allCountries.map(country => ({
    params: {
      country: kebabCase(country.name.trim())
    }
  }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps ({ params }) {
  const allCountries = await getAllCountries()
  const [getCountry] = allCountries.filter(entry => kebabCase(entry.name) === params.country)

  const last = getCountry.stats[getCountry.stats.length - 30]
  const first = getCountry.stats[getCountry.stats.length - 1]


  return {
    props: {
      data: getCountry || [],
      thirtyDaysAgo: last,
      today: first,
      change: {
        active: percentageChange(last.active, first.active),
        cases: percentageChange(last.cases, first.cases),
        deaths: percentageChange(last.deaths, first.deaths),
        critical: percentageChange(last.critical, first.critical),
        recovered: percentageChange(last.recovered, first.recovered)
      },
      all: allCountries.map(entry => ({
        name: entry.name,
        flag: entry.flag || '',
        iso: entry.iso || ''
      }))
    }
  }
}

export default Country
