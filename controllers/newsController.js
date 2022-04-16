var apiKey = "34dd0b752c2b4b488e9418bd27a4ee03"
const axios = require('axios');
const res = require('express/lib/response');

const getNews = async (req, res) => {
  try {
    let data = []
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: "in",
        apiKey: apiKey,
        category: "technology"
      }
    })
    .then(function (response) {
      let temp = response.data.articles
      temp.forEach((item) => {
        if(item.title && item.description && item.urlToImage && item.publishedAt){
          data.push({
            title: item.title,
            description: item.description,
            urlToImage: item.urlToImage,
            publishedAt: item.publishedAt,
            url: item.url
          })
        }
      })
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function() {
      res.render('pages/news', {status: "login", news: data})
    })
    
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getNews }