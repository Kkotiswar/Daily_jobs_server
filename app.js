const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Fetch the HTML content of the web page
axios.get('https://github.com/bsovs/Fall2023-Internships')
  .then(response => {
    // Parse the HTML content using Cheerio
    const $ = cheerio.load(response.data);

    // Find the table element and extract the table rows
    const table = $('table');
    const tableRows = table.find('tbody tr');

    // Define an empty array to store the job data
    const jobs = [];

    // Iterate over the table rows and extract the job information
    tableRows.each((index, row) => {
      const position = $(row).find('td:nth-child(1)').text().trim();
      const location = $(row).find('td:nth-child(2)').text().trim();
      const applicationPeriod = $(row).find('td:nth-child(3)').text().trim();
      const notes = $(row).find('td:nth-child(4)').text().trim();
      const link = $(row).find('td:nth-child(1) a').attr('href');

      const job = {
        position,
        location,
        applicationPeriod,
        notes,
        link
      };

      jobs.push(job);
    });

    // Structure the job data into a JSON object
    const data = { jobs };

    // Write the data to a JSON file
    // fs.writeFileSync('jobs.json', JSON.stringify(data));

    // Set up an API endpoint to serve the JSON data
    app.get('/getJobs', (req, res) => {
      console.log("API is Called");
      res.json(data);
    });

    // Start the server
    const port = 3000 || process.env.PORT;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.log('Error:', error);
  });
