import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        </Head>
        <body style={{
          backgroundColor: '#F7FAFC'
        }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
