import styled from 'styled-components'

const Label = styled.span`
  font-size: 1.7rem;
  color: ${ ({ theme }) => theme.color.grey[4] };
  padding: 1.2em 0;
  display: block;
  text-align: center;
`

export default Label
