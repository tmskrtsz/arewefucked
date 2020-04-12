import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { Area } from '../components/Chart'

export default () => {
  const { mongodbCovidCountries: data } = useStaticQuery(query)

  return (
    <>
      <h1>All</h1>
    </>
  )
}

export const query = graphql`
  query {
    mongodbCovidCountries(name: {eq: "all"}) {
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
}`
