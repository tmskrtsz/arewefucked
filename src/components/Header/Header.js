import React from 'react'
import styled from 'styled-components'
import { rgba } from 'polished'
import { Link } from 'gatsby'

import { Flex, Box } from '../Grid/Flexbox'
import BodyWrapper from '../Grid/Wrapper'
import Search from '../Search/Search'
import logoImage from '../../images/logo.svg'

const Wrapper = styled.header`
  width: 100%;
  padding: 1em 0;
  background-color: ${ ({ theme }) => theme.color.grey[1] };
  border-bottom: 1px solid ${ ({ theme }) => theme.color.grey[3] };
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
`

const Logo = styled(Link)`
  display: inline-block;
  font-weight: 700;
  color: ${ ({ theme }) => theme.text.color };
  font-size: 2.4rem;
  background-image: url(${ logoImage });
  background-position: left center;
  background-size: 42px;
  background-repeat: no-repeat;
  text-indent: 48px;
`

const Header = () => {
  return (
    <Wrapper>
      <BodyWrapper>
        <Flex alignItems="center">
          <Box width={1 / 4}>
            <Logo to="/">
              <span>Are We Fucked?</span>
            </Logo>
          </Box>
          <Box width={2 / 4}>
            <Search />
          </Box>
        </Flex>
      </BodyWrapper>
    </Wrapper>
  )
}
export default Header
