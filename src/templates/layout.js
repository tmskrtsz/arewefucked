import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbySeo } from 'gatsby-plugin-next-seo'

import { Wrapper, Header } from '../components'
import StyledProvider from '../theme/Provider'

const Layout = ({ children }) => {
  const {
    site: {
      siteMetadata
    }
  } = useStaticQuery(query)

  return (
    <>
      <GatsbySeo
        titleTemplate={siteMetadata.titleTemplate}
        description={siteMetadata.description}
        languageAlternate={[{
          hrefLang: 'en',
          href: siteMetadata.siteUrl,
        }]}
      />
      <StyledProvider>
        <Wrapper mt={120}>
          <Header />
          {children}
        </Wrapper>
      </StyledProvider>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        titleTemplate
        description
        siteUrl
      }
    }
  }
`

export default Layout
