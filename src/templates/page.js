import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { graphql } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import { GatsbySeo } from 'gatsby-plugin-next-seo'

import {
  Container,
  Heading,
  Flex,
  Box,
  Chart,
  Breadcrumbs,
  Button,
  Secondary
} from '../components'

import { formatNumber, percentageChange } from '../utils'

const FlagBg = styled.div`
  width: 100%;
  height: 420px;
  position: relative;
  overflow: hidden;
  border-radius: ${ ({ theme }) => theme.radii.xl };

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

const FlagAvatar = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 4px;
  width: 72px;

  img {
    z-index: 200;
    max-width: 100%;
    border-radius: ${ ({ theme }) => theme.radii.sm };
  }
`

const Page = ({ data }) => {
  const [activeSet, setActiveSet] = useState('active')
  const [period, setPeriod] = useState(30)
  const [change, setChange] = useState({})
  const { mongodbCovidCountries: res } = data
  const { stats, metadata, name } = res

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
      critical: percentageChange(last.critical, first.critical),
      recovered: percentageChange(last.recovered, first.recovered)
    })
  }, [last, first])

  return (
    <>
      <GatsbySeo
        title={`${name} Statistics`}
        description={`COVID-19 statistics for ${name}. Based on the last 30 days of data`}
      />
      <Flex flexDirection="column">
        <Box width={1}>
          <Flex alignItems="center">
            <Heading as="h1">{name}</Heading>
            <Heading
              as="span"
              css={`
                font-size: 2rem;
                margin-left: 0.5em;
                opacity: 0.4;
              `}
            >
              (Last 30 Days)
            </Heading>
          </Flex>
        </Box>
        <Box pb={4}>
          <Breadcrumbs links={[
            {
              name,
              path: kebabCase(name.toLowerCase())
            }
          ]}
          />
        </Box>
      </Flex>
      <Box>
        <Flex flexDirection="column">
          <FlagBg bgFlag={metadata.flag} />
        </Flex>
      </Box>
      <Flex
        mt={-140}
        mx={4}
      >
        <Container
          width={1}
          p={4}
        >
          <Flex
            pb={4}
            alignItems="center"
          >
            <Box width={1 / 2}>
              <FlagAvatar>
                <img
                  src={metadata.flag}
                  alt={name}
                />
              </FlagAvatar>
            </Box>
            <Box width={1 / 2}>
              <Flex alignItems="center" justifyContent="flex-end">
                <Box width={1 / 5} textAlign="center">
                  <Heading
                    as="h6"
                    muted
                  >Active</Heading>
                  <Heading as="h5">{formatNumber(last.active)}</Heading>
                </Box>
                <Box width={1 / 5} textAlign="center">
                  <Heading
                    as="h6"
                    muted
                  >Cases</Heading>
                  <Heading as="h5">{formatNumber(last.cases)}</Heading>
                </Box>
                <Box width={1 / 5} textAlign="center">
                  <Heading
                    as="h6"
                    muted
                  >Deaths</Heading>
                  <Heading as="h5">{formatNumber(last.deaths)}</Heading>
                </Box>
                <Box width={1 / 5} textAlign="center">
                  <Heading
                    as="h6"
                    muted
                  >Critical</Heading>
                  <Heading as="h5">{formatNumber(last.critical)}</Heading>
                </Box>
                <Box width={1 / 5} textAlign="center">
                  <Heading
                    as="h6"
                    muted
                  >Recovered</Heading>
                  <Heading as="h5">{formatNumber(last.recovered)}</Heading>
                </Box>
              </Flex>
            </Box>
          </Flex>

          <Flex flexDirection="column">
            <Box wdith={1} pb={4}>
              <Heading as="h3">Statistics</Heading>
            </Box>
            <Box width={1}>
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
            </Box>
          </Flex>
          <Chart
            data={stats}
            dataSet={activeSet}
            period={period}
          />
        </Container>
      </Flex>
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

Page.propTypes = {
  data: PropTypes.shape({
    mongodbCovidCountries: PropTypes.shape({
      mongodb_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        flag: PropTypes.string.isRequired,
        iso: PropTypes.string.isRequired
      }),
      stats: PropTypes.shape({
        updated: PropTypes.string.isRequired,
        active: PropTypes.string.isRequired,
        affectedCountries: PropTypes.string.isRequired,
        cases: PropTypes.string.isRequired,
        casesPerOneMillion: PropTypes.string.isRequired,
        critical: PropTypes.string.isRequired,
        deaths: PropTypes.string.isRequired,
        deathsPerOneMillion: PropTypes.string.isRequired,
        tests: PropTypes.string.isRequired,
        recovered: PropTypes.string.isRequired,
        testsPerOneMillion: PropTypes.string.isRequired,
        todayCases: PropTypes.string.isRequired,
        todayDeaths: PropTypes.string.isRequired,
      })
    })
  }).isRequired
}

export default Page
