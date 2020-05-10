import styled, { css } from 'styled-components'

const Heading = styled.h1`
  color: ${ ({ theme }) => theme.text.color };

  ${({ muted }) => muted && css`
    font-size: 2rem;
    margin-left: 0.5em;
    opacity: 0.4;
  `}
`

export default Heading
