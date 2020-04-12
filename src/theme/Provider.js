import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import global from './theme'

const Global = createGlobalStyle`
  :root {
    --dark: ${ ({ theme }) => theme.color.grey };
    --font: ${ ({ theme }) => theme.text.font };
    --font-size-body: ${ ({ theme }) => theme.text.size.body };
  }

  html {
    font-size: 62.5%;
  }

  body {
    background-color: var(--dark);
    font-family: var(--font);
    font-size: var(--font-size-body);
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
