import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useStaticQuery, graphql, Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import { useClickOutside } from 'react-click-outside-hook'

import Input from '../Input/Input'
import searchIcon from '../../images/search.svg'

const Group = styled.div`
  display: flex;
  position: relative;

  ${ Input } {
    text-indent: 1em;

    ${({ active }) => active && css`
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-color: ${ ({ theme }) => theme.color.grey[3] };
    `}
  }
`

const Icon = styled.img`
  position: absolute;
  left: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  height: 250px;
  background-color: ${ ({ theme }) => theme.color.grey[0] };
  border: 2px solid ${ ({ theme }) => theme.color.blue[0] };
  z-index: 200;
  border-bottom-left-radius: ${ ({ theme }) => theme.radii.sm };
  border-bottom-right-radius: ${ ({ theme }) => theme.radii.sm };
  border-top: 0;
  overflow-y: scroll;

  span {
    padding: 0.9em 1.2em;
    display: block;
    color: ${ ({ theme }) => theme.color.grey[4] };
  }
`

const Result = styled(Link)`
  background-color: ${ ({ theme }) => theme.color.grey[2] };
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.9em 1.2em;
  color: ${ ({ theme }) => theme.text.color };

  &:not(:last-child) {
    border-bottom: 1px solid ${ ({ theme }) => theme.color.grey[3] };
  }

  :hover {
    background-color: ${ ({ theme }) => theme.color.blue[0] };
  }

  img {
    height: 24px;
  }
`

const Search = () => {
  const { data } = useStaticQuery(searchQuery)
  const [results, setResults] = useState([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [ref, hasClickedOutside] = useClickOutside()

  useEffect(() => {
    if (query.length > 0) {
      setResults(data.nodes.filter(el =>
        el.name.toLowerCase().includes(query)
      ))
    } else {
      setResults([])
    }
  }, [query])

  function getInput (e) {
    setQuery(e.target.value.toLowerCase())
  }

  if (active && hasClickedOutside) {
    setActive(false)
  }

  return (
    <Group
      ref={ref}
      active={active}
    >
      <Icon src={searchIcon} alt="Search icon" />
      <Input
        placeholder="Search for a country"
        onChange={getInput}
        onClick={() => setActive(!active)}
      />
      {active && (
        <Dropdown>
          {results.length === 0
            ? (<span>Search countries. For example "Finland"</span>)
            : (results.map(e => (
              <Result
                key={e.name}
                to={`/${kebabCase(e.name)}`}
                onClick={() => setActive(false)}
              >
                {e.name}
                {e.metadata.iso && (
                  <img
                    src={`https://www.countryflags.io/${ e.metadata.iso.toLowerCase() }/shiny/24.png`}
                    alt={`Flag of ${e.name}`}
                  />
                )}
              </Result>
            )))
          }
        </Dropdown>
      )}
    </Group>
  )
}

export const searchQuery = graphql`
  query {
    data: allMongodbCovidCountries {
    nodes {
      name
      metadata {
        iso
      }
    }
  }
}`

export default Search
