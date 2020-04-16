import styled from 'styled-components'

const Button = styled.button`
  appearance: none;
  background-color: ${ ({ theme }) => theme.color.blue[0] };
  border: 0;
  color: ${ ({ theme }) => theme.text.color };
  font-size: 1.7rem;
  cursor: pointer;
`

export default Button
