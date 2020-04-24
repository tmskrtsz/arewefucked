import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import { Heading, Flex, Box } from '../components'

const Hero = styled(Box)`
`

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
  background-color: ${ ({ theme }) => theme.color.grey[3] };
  display: inline-block;
  padding: 0.7em;
  border-radius: 12px;

  img {
    z-index: 200;
    max-width: 184px;
    border-radius: ${ ({ theme }) => theme.radii.md };
    border: 3px solid white;
  }
`

const Page = ({ data }) => {
  const { mongodbCovidCountries: res } = data

  return (
    <>
      <Flex alignItems="center">
        <Heading as="h1">{res.name}</Heading>
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
      <Hero>
        <Flex flexDirection="column">
          <FlagBg bgFlag={res.metadata.flag} />
          <Box my={-50}>
            <FlagAvatar>
              <img src={res.metadata.flag} />
            </FlagAvatar>
          </Box>
        </Flex>
      </Hero>
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
