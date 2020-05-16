import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { formatNumber } from '../../utils'
import Container from '../Container/Container'
import { Flex, Box } from '../Grid/Flexbox'
import Label from '../Text/Label'
import Heading from '../Text/Heading'
import Change from '../Change/Change'

const Description = styled(Box)`
  ${ Heading },
  ${ Label } {
    padding: 0;
    margin: 0;
    text-align: left;
  }

  ${ Label } {
    font-size: 1.4rem;
    margin-bottom: 0.3em;
  }

  ${ Heading } {
    font-weight: 700;
  }
`

const IconContainer = styled(Box)`
  img {
    border-radius: ${ ({ theme }) => theme.radii.md };
    background-color: ${ ({ theme }) => theme.color.grey[1] };
    padding: 0.5em;
  }
`

const StatsBox = ({ stats, label, icon, ...rest }) => {
  return (
    <Container {...rest}>
      <Flex
        alignItems="space-between"
        flexDirection="column"
      >
        <IconContainer
          mb={100}
          mt={4}
        >
          <img src={icon} alt={label} />
        </IconContainer>
        <Description>
          <Flex flexDirection="column">
            <Label>{label}</Label>
            <Flex
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading as="h5">{formatNumber(stats.absolute)}</Heading>
              <Change criteria={stats.changeCriteria}>{stats.change}</Change>
            </Flex>
          </Flex>
        </Description>
      </Flex>
    </Container>
  )
}

StatsBox.propTypes = {
  label: PropTypes.string.isRequired,
  stats: PropTypes.shape({
    absolute: PropTypes.number.isRequired,
    change: PropTypes.string.isRequired,
    changeCriteria: PropTypes.oneOf(['positive', 'negative']).isRequired
  }).isRequired,
  icon: PropTypes.string.isRequired
}

export default StatsBox
