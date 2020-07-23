export default class model {
  getAppModel() {
    return fetch('./config.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
  }
}
