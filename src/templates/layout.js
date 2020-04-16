import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper, Header } from '../components'

const Layout = ({ children }) => {
  return (
    <Wrapper>
      <Header />
      {children}
    </Wrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
