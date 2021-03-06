import { theme } from '@chakra-ui/react'

// Let's say you want to add custom colors
export default {
  ...theme,
  colors: {
    ...theme.colors,
    background: theme.colors.gray[50]
  },
}
