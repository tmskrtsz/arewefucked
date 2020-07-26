import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import Head from 'next/head'

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Worldwide Statistics /// Are We Fucked?</title>
        <meta
          name="description"
          content="COVID-19 statistics based on the last 30 days of data"
        />
      </Head>
      <ThemeProvider>
        <CSSReset />
        <Component { ...pageProps } />
      </ThemeProvider>
    </>
  )
}

export default App
