require('dotenv').config({
  path: '.env',
})

module.exports = {
  siteMetadata: {
    title: 'Are We Fucked?'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve('./src/templates/layout.js'),
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
      },
    },
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Manrope:400,600,700']
        }
      }
    },
    'gatsby-plugin-react-helmet',
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
    }
  ],
}
