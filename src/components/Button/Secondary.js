import styled from 'styled-components'

const Secondary = styled.button`
  appearance: none;
  background-color: transparent;
  border: 2px solid ${ ({ theme }) => theme.color.grey[2] };
  color: ${ ({ theme }) => theme.text.color };
  font-size: 1.7rem;
  cursor: pointer;
`

export default Secondary
