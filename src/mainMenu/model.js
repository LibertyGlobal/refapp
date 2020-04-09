export default class model {
  getMenu() {
    return fetch('./static/menu.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
  }
}
