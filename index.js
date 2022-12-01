/*
    API to track and list all news articles related to climate change.
    This API uses the following open-source software:
        • Node JS for server side shananigans
        • ExpressJS to minimize the amount of code needed
        • Axios JS for making our HTTP requests like GET, PUT etc.
        • Cheerio JS for working with and manipulating the html elements we retrieve
*/
const app = require("express")();
const axios = require("axios");
const cheerio = require("cheerio");
const PORT = 8000;

app.get("/news", (req, res) => {
  axios
    .get("https://www.theguardian.com/environment/climate-crisis")
    .then((response) => {

      // Store the html retrieved via the axios http GET request
      const html = response.data;

      // Load the retrieved html into the cheerio instance and store to $ cheerio selector
      const $ = cheerio.load(html);

      // DEBUG purpose stuff
      var articleCount = $("a:contains(climate)", html).length;
      console.log("Number of articles found: " + articleCount);
      //

      // Get all articles that contain 'climate' in the <a /> element
      var allFoundArticles = $('a:contains("climate")', html);

      // Create empty array to hold output data
      const articlesData = [];
     
     // Iterate through all found articles using cheerio forEach loop
      allFoundArticles
        .each(function () {
          // Assign article title and url it is located at to variables
          var title = $(this).text();
          var url = $(this).attr("href");

          // Push the previously defined vars to the previously defined array
          articlesData.push({
            title,
            url,
          });
        })

      // Output article details to page as response AFTER LOOP HAS FINISHED!!!!!
      // Otherwise we would get ERR_HTTP_HEADERS_SENT error
      res.json(articlesData);

    })
    .catch(err => {
        res.status(500).json({message: err.message});
      });
})


app.listen(8000);