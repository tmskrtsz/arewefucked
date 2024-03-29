import React, { useState, useEffect } from 'react'
import {
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import kebabCase from 'lodash/kebabCase'
import { useClickOutside } from 'react-click-outside-hook'
import { Link, graphql, useStaticQuery } from 'gatsby'
import { SearchIcon } from '@chakra-ui/icons'

const Group = styled.div`
  display: flex;
  position: relative;

  ${({ active }) => active && css`
    input[type=search] {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-color: ${ ({ theme }) => theme.colors.blue[500] };
    }
  `}
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  width: 100%;
  max-height: 250px;
  background-color: ${ ({ theme }) => theme.colors.gray[100] };
  border: 2px solid ${ ({ theme }) => theme.colors.blue[500] };
  z-index: 200;
  border-bottom-left-radius: ${ ({ theme }) => theme.radii.sm };
  border-bottom-right-radius: ${ ({ theme }) => theme.radii.sm };
  border-top: 0;
  overflow-y: auto;

  span {
    padding: 0.9em 1.2em;
    display: block;
    color: ${ ({ theme }) => theme.colors.gray[400] };
  }
`

const Result = styled.a`
  background-color: ${ ({ theme }) => theme.colors.white[200] };
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.9em 1.2em;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid ${ ({ theme }) => theme.colors.gray[200] };
  }
  :hover {
    background-color: ${ ({ theme }) => theme.colors.blue[200] };
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
      <label
        htmlFor="search"
        style={{
          position: 'absolute',
          top: '-500px'
        }}
      >
        Search country list
      </label>
      <InputGroup w="100%">
        <InputLeftElement
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          w="100%"
          id="search"
          type="search"
          placeholder="Search for a country"
          onChange={getInput}
          onClick={() => setActive(!active)}
          autoComplete={false}
        />
      </InputGroup>
      {active && (
        <Dropdown>
          {results.length === 0
            ? (<span>Search countries. For example &quot;Finland&quot;</span>)
            : (results.map(e => (
              <Link
                key={e.name}
                href={`/${kebabCase(e.name)}`}
              >
                <Result
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
              </Link>
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
