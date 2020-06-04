export default class model {
  getMovie() {
    return fetch('./cache/demo/movies.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
  }
  //recommended_data
  getRecommend() {
    return fetch('./cache/demo/movies.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data.slice(0, 3)
      })
  }
}
