import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'gatsby'

const LinkItem = styled(Link)`
  display: inline-block;

  span {
    border-bottom: 1px solid ${ ({ theme }) => theme.color.grey[3] };
    color: ${ ({ theme }) => theme.text.color };
    font-size: 1.4rem;
  }

  :hover {
    span {
      border-color: ${ ({ theme }) => theme.color.blue[0] };
    }
  }
`

const Links = styled.nav`
  z-index: 100;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: inline-block;

    ${ LinkItem } {

      &::before {
        content: '>';
        margin: 0 0.5em;
        color: ${ ({ theme }) => theme.color.grey[4] };
      }
    }
  }
`

const Breadcrumbs = ({ links }) => {
  return (
    <Links>
      <LinkItem to="/">
        <span>Home</span>
      </LinkItem>
      <ul>
        {links.map(link => (
          <LinkItem
            key={link.name}
            to={link.path}
          >
            <span>{link.name}</span>
          </LinkItem>
        ))}
      </ul>
    </Links>
  )
}

Breadcrumbs.propTypes = {
  links: PropTypes.shape({
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
}

export default Breadcrumbs
