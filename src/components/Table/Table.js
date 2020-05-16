import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'

import { Flex, Box, Secondary, Heading } from '..'
import { formatNumber } from '../../utils'

const TableHeader = styled(Flex)`
  border-bottom: 2px solid ${ ({ theme }) => theme.color.grey[2] };

  span {
    font-size: 1.7rem;
    font-weight: 700;
    color: ${ ({ theme }) => theme.color.grey[4] };
  }
`

const TableBody = styled(Box)``

const TableRow = styled(Flex)`
  border-bottom: 2px solid ${ ({ theme }) => theme.color.grey[2] };
  color: ${ ({ theme }) => theme.text.color };
  position: relative;

  :hover {
    background-color: ${ ({ theme }) => theme.color.grey[2] };

    a {
      background-color: ${ ({ theme }) => theme.color.blue[0] };
      border-color: ${ ({ theme }) => theme.color.blue[0] };
      color: #fff;
    }
  }

  img {
    max-width: 32px;
    border-radius: 2px;
  }

  a {
    strong {
      color: ${ ({ theme }) => theme.text.color };
      font-weight: 600;
      margin-left: 1em;
    }
  }
`

const Table = ({ header, items }) => {
  return (
    <>
      <TableHeader py={2} px={3}>
        {header.map(item => (
          <Box
            key={item}
            width={[1 / header.length ]}
          >
            <span>{item}</span>
          </Box>
        ))}
      </TableHeader>
      <TableBody flexDirection="column">
        {items.map(entry => (
          <TableRow
            key={entry.name}
            py={3}
            px={3}
            alignItems="center"
          >
            <Box width={[1 / 5]}>
              <Link to={`/${entry.name.toLowerCase()}`}>
                <Flex alignItems="center">
                  <img
                    src={`https://www.countryflags.io/${ entry.iso.toLowerCase() }/shiny/64.png`}
                    alt={`Flag of ${entry.name}`}
                  />
                  <strong>{entry.name}</strong>
                </Flex>
              </Link>
            </Box>
            <Box width={[1 / 5]}>
              {formatNumber(entry.stats.cases)}
            </Box>
            <Box width={[1 / 5]}>
              {formatNumber(entry.stats.deaths)}
            </Box>
            <Box width={[1 / 5]}>
              {formatNumber(entry.stats.critical)}
            </Box>
            <Box width={[1 / 5]}>
              <Flex justifyContent="space-between" alignItems="center">
                {formatNumber(entry.stats.recovered)}
                <Secondary as={Link} to={`/${kebabCase(entry.name.toLowerCase())}`}>
                  More
                </Secondary>
              </Flex>
            </Box>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

export default Table
