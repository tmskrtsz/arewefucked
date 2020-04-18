import styled from 'styled-components'

import { buttonStyles } from './Button'

const Secondary = styled.button`
  ${ buttonStyles };
  background-color: transparent;
  border: 2px solid ${ ({ theme }) => theme.color.grey[2] };
  color: ${ ({ theme }) => theme.color.grey[4] };

  :hover {
    /* color: ${ ({ theme }) => theme.color.blue[0] }; */
    border-color: ${ ({ theme }) => theme.color.grey[3] };
  }
`

export default Secondary
