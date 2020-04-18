import styled, { css } from 'styled-components'

function buttonStyles () {
  return css`
    font-size: 1.7rem;
    cursor: pointer;
    padding: 0.3em 0.5em;
    border-radius: ${ ({ theme }) => theme.radii.sm };
    appearance: none;
    border: 0;
    text-transform: capitalize;
    `
}

const Button = styled.button`
  ${ buttonStyles };
  background-color: ${ ({ theme }) => theme.color.blue[0] };
  color: ${ ({ theme }) => theme.text.color };
  border: 2px solid ${ ({ theme }) => theme.color.blue[0] };
`

export { Button as default, buttonStyles }
