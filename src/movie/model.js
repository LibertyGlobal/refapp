export default class model {
  getMenu() {
    return fetch('./cache/demo/movies.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
  }
}
