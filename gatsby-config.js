require('dotenv').config({
  path: '.env',
})

module.exports = {
  siteMetadata: {
    titleTemplate: '%s /// Are We Fucked?',
    description: 'Track COVID-19 data across multiple countries',
    siteUrl: 'https://www.arewefucked.app'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-chakra-ui',
      options: {
        isResettingCSS: true,
        isUsingColorMode: false,
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Are We Fucked?',
        short_name: 'AreWeFucked',
        start_url: '/',
        background_color: '#f7f0eb',
        theme_color: '#a2466c',
        display: 'standalone',
        icon: './src/images/logo.svg'
      },
    },
    {
      resolve: 'gatsby-source-mongodb',
      options: {
        connectionString: process.env.ATLAS_URI,
        dbName: 'covid',
        collection: 'countries',
        extraParams: {
          retryWrites: true,
          w: 'majority'
        }
      },
    },
    {
      resolve: 'gatsby-plugin-next-seo',
      options: {
        titleTemplate: '%s /// Are We Fucked?',
        language: 'en',
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svg-components/
        }
      }
    },
    {
      resolve: 'gatsby-plugin-heap',
      options: {
        appId: process.env.HEAP
      }
    }
  ],
}
