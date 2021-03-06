import React, { useState } from 'react'
import { Flex, Box, Text } from '@chakra-ui/react'
import { graphql, useStaticQuery } from 'gatsby'
import Particles from 'react-particles-js'
import { percentageChange } from '../../utils/percentageChange'

const params = {
  particles: {
    number: {
      value: 300,
      density: {
        enable: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        speed: 10,
        size_min: 0.3
      }
    },
    line_linked: {
      enable: false
    },
    move: {
      random: true,
      speed: 10,
      direction: "top",
      out_mode: "out"
    }
  }
}

const Hero = () => {
  const [show, setShow] = useState(false)
  const { data } = useStaticQuery(query)

  const change = (
    data.stats[data.stats.length - 1].active -
    data.stats[data.stats.length - 2].active
  ).toLocaleString()

  function isDireSituation(num) {
    const toNumber = parseInt(num.split(',').join(''))
    return Math.sign(toNumber) < 0 ? 'No' : 'Yes'
  }

  return (
    <Flex
      backgroundImage="linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
      mx={2}
      p={12}
      py={24}
      mb={2}
      rounded="lg"
      justifyContent="center"
      alignItems="center"
      position="relative"
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => ''}
    >
      <Box position="absolute" left="0" top="0">
        {show ? <Particles params={params} /> : null }
      </Box>
      <Text
        fontSize="5xl"
        fontWeight="700"
        color="white"
        textShadow="0 2px 3px rgba(0,0,0,0.15)"
      >
        {show ? `24h Cases: ${change}` : isDireSituation(change)}
      </Text>
    </Flex>
  )
}

export const query = graphql`
  query {
    data: mongodbCovidCountries(name: {eq: "worldwide"}) {
      id
      stats {
        active
      }
    }
  }
`

export default Hero
