import React from 'react'
import PropTypes from 'prop-types'

import Layout from './layout'

const Page = ({ data }) => {
  const { mongodbCovidCountries: res } = data

  return (
    <Layout>
      <h1>{res.name}</h1>
    </Layout>
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
