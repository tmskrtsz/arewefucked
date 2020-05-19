import styled from 'styled-components'

const Input = styled.input`
  border: 2px solid ${ ({ theme }) => theme.color.grey[3] };
  background-color: ${ ({ theme }) => theme.color.grey[0] };
  width: 100%;
  padding: 0.8em 1.2em;
  border-radius: ${ ({ theme }) => theme.radii.sm };
  color: ${ ({ theme }) => theme.text.color };
  font-family: ${ ({ theme }) => theme.text.font };

  :focus {
    border-color: ${ ({ theme }) => theme.color.blue[0] };
  }
`

export default Input
