import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper, Header } from '../components'
import StyledProvider from '../theme/Provider'

const Layout = ({ children }) => {
  return (
    <StyledProvider>
      <Wrapper mt={120}>
        <Header />
        {children}
      </Wrapper>
    </StyledProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
