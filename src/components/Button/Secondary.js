import styled from 'styled-components'

import { buttonStyles } from './Button'

const Secondary = styled.button`
  ${ buttonStyles };
  background-color: transparent;
  border: 2px solid ${ ({ theme }) => theme.color.grey[2] };
  color: ${ ({ theme }) => theme.text.color };
`

export default Secondary
