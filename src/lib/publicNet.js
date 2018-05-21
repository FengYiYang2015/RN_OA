let publicNet = {
  postJson(url, data, callback) {
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // 'Accept': 'application/xml',
        // 'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data;charset=utf-8'
        // 'Content-Type': 'multipart/form-data;boundary=6ff46e0b6b5148d984f148b6542e5a5d'
      },
      body: data
    }

    fetch(url, fetchOptions).then((response) => response.json()).then((responseJson) => {
      callback(responseJson)
    }).done()
  }
}

export default publicNet