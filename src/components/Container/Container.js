import styled from 'styled-components'
import { darken } from 'polished'

import { Box } from '../Grid/Flexbox'

const Container = styled(Box)`
  background-color: ${ ({ theme }) => theme.color.grey[2] };
  border-radius: ${ ({ theme }) => theme.radii.md };
  box-shadow: 0 6px 20px -8px ${ ({ theme }) => darken(0.02, theme.color.grey[0]) };
`

export default Container
