import apiConfig from './apiConfig'

const sendParam = (query = {}) => {
  return query ? Object.keys(query).map(key => {
    return key + ':' + query[key]
  }).join('\n') : ''
}

export default (url, query) => {
  let mergeUri = `${apiConfig.baseUri}${url}`
  return new Promise((resolve, reject) => {
    fetch(`${mergeUri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: sendParam(query)
    }).then(response => {
      return response.json()
    }).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error.toString())
    })
  })
}