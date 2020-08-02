const fetch = require('node-fetch')

// Fetch wrapper
exports.get = async (endpoint, customConfig = {}) => {
  const config = {
    method: 'GET',
    ...customConfig,
  }

  return fetch(endpoint, config)
    .then(async response => {
      const data = await response.json()
      if (response.ok) {
        return data
      }
      return Promise.reject(data)
    })
}

