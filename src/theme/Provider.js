import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import global from './theme'

const Global = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

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
    letter-spacing: -1.4px;
  }

  h2 {
    font-size: 4rem;
    letter-spacing: -0.9px;
  }

  h3 {
    font-size: 3.3rem;
    letter-spacing: -0.5px;
  }

  h4 {
    font-size: 2.7rem;
    letter-spacing: -0.33px;
  }

  h5 {
    font-size: 2.2rem;
    letter-spacing: -0.1px;
  }

  h6 {
    font-size: 1.4rem;
  }

  h1, h2, h3,
  h4, h5, h6 {
    margin: 0;
  }

  ::placeholder {
    color: ${ ({ theme }) => theme.color.grey[4] };
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
