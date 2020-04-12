import React from 'react'
import { StyledProvider } from './src/theme'

export const wrapRootElement = ({ element }) =>
  <StyledProvider>{element}</StyledProvider>
