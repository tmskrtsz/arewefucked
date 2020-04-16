import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import global from './theme'

const Global = createGlobalStyle`
  html {
    font-size: 62.5%;
  }

  body {
    background-color: ${ ({ theme }) => theme.color.grey[1] };
    font-family: ${ ({ theme }) => theme.text.font };
    font-size: ${ ({ theme }) => theme.text.size.body };
    color: ${ ({ theme }) => theme.text.color };
  }

  a {
    text-decoration: none;
  }

  h1 {
    font-size: 4.8rem;
  }

  h2 {
    font-size: 4rem;
  }

  h3 {
    font-size: 3.3rem;
  }

  h4 {
    font-size: 2.7rem;
  }

  h5 {
    font-size: 2.2rem;
  }

  h6 {
    font-size: 1.7rem;
  }
`

const StyledProvider = ({ children }) => {
  return (
    <ThemeProvider theme={global}>
      <Global />
      {children}
    </ThemeProvider>
  )
}

StyledProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default StyledProvider
