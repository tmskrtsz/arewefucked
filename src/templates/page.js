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
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/core'
import { Link, graphql } from 'gatsby'
import styled from '@emotion/styled'
import { GatsbySeo } from 'gatsby-plugin-next-seo'

import { Wrapper, Chart } from '../components'
import { formatNumber } from '../utils'
import { dataSets } from '../pages'

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

function Page ({ data }) {
  const [activeSet, setActiveSet] = useState('active')
  const [period, setPeriod] = useState(30)
  const theme = useTheme()

  const { mongodbCovidCountries: {
    stats,
    metadata,
    name
  } } = data

  const last = stats[stats.length - 30]
  const today = stats[stats.length - 1]

  const periodSet = [
    {
      length: 30,
      label: '30 Days',
    },
    {
      length: stats.length,
      label: 'All Time',
    }
  ]

  return (
    <>
      <GatsbySeo
        title={`${name} Statistics`}
        description={`COVID-19 statistics for ${name}. Based on the last 30 days of data`}
      />
      <Wrapper>
        <Breadcrumb mb={24}>
          <BreadcrumbItem>
            <Link href="/">
              <BreadcrumbLink as="a">Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">{name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex flexDirection="column">
          <Badge mr="auto">Last 24 Hours</Badge>
          <Heading as="h1" size="2xl">{name}</Heading>
        </Flex>
        <Flex
          my={12}
          zIndex={theme.zIndices.hide}
        >
          <Box w="100%" h="100%" borderRadius="2xl">
            <FlagBg bgFlag={metadata.flag} />
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
                  src={metadata.flag}
                  alt={`Flag of ${name}`}
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
              data={stats}
              dataSet={activeSet}
              period={period}
            />
          </Box>
        </Flex>
      </Wrapper>
    </>
  )
}

export const query = graphql`
  query($id: String!) {
    mongodbCovidCountries(mongodb_id: { eq: $id }) {
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
      metadata {
        flag
        iso
      }
    }
  }
`

export default Page
