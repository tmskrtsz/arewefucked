import React from 'react'
import { Flex, Box, Text, useTheme } from '@chakra-ui/core'
import Link from 'next/link'

import Search from '../Search/Search'
import Logo from '../../images/logo.svg'

const Wrapper = ({ children, allCountries }) => {
  const theme = useTheme()

  return (
    <>
      <Flex
        as="header"
        py={4}
        position="fixed"
        top={0}
        left={0}
        w="100%"
        borderBottom="1px solid"
        borderBottomColor="gray.200"
        bg="gray.50"
        zIndex={theme.zIndices.sticky}
      >
        <Flex
          w={1180}
          mx="auto"
          alignItems="center"
        >
          <Box width={1 / 3}>
            <Link href="/">
              <a>
                <Flex alignItems="center">
                  <Box w="42px">
                    <Logo />
                  </Box>
                  <Box ml={2}>
                    <Text fontSize="2xl" fontWeight="700">Are We Fucked?</Text>
                  </Box>
                </Flex>
              </a>
            </Link>
          </Box>
          <Box width={1 / 3}>
            <Search data={allCountries} />
          </Box>
        </Flex>
      </Flex>
      <Box w={1180} mx="auto">
        <Box mt={100}>
          {children}
        </Box>
      </Box>
    </>
  )
}

export default Wrapper
