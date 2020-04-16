import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

const Wrapper = styled.header`
  padding: 2em 0;
`

const Logo = styled(Link)`
  display: inline-block;
  font-weight: 700;
  color: ${ ({ theme }) => theme.text.color };
  font-size: 2.4rem;
`

const Header = () => {
  return (
    <Wrapper>
      <Logo to="/">
        <span role="img" aria-label="Poop">💩</span> Are We Fucked?</Logo>
    </Wrapper>
  )
}
export default Header
