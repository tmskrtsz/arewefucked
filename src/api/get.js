import fetch from 'node-fetch'

// Fetch wrapper
const get = async (endpoint, customConfig = {}) => {
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

export { get }
