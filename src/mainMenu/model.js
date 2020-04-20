export default class model {
  getMenu() {
    return fetch('./cache/menu.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
  }
}
