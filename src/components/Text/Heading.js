import styled, { css } from 'styled-components'

const Heading = styled.h1`
  color: ${ ({ theme }) => theme.text.color };

  ${({ muted }) => muted && css`
    opacity: 0.4;
    font-weight: 400;
  `}
`

export default Heading
