import React from 'react'
import Document, { Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html>
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
