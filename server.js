// server.js

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

// API route
app.get('/api/data', async (req, res) => {
  const apiKey = 'AIzaSyC3oGB9sdUrokD-OrMdx0ol0TBdhf2gudQ'; // Replace with your actual API key
  const spreadsheetId = '1L_8B_G50Y0oHJ46IWmspRYS5l_VcWr_MU5qR9lBcMQs'; // Replace with your actual Spreadsheet ID
  const range = 'Sheet1!A2:F';  // Updated to fetch columns A to F

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

  try {                                                                                                                                                                                                                                                                
    const response = await fetch(url);
    const jsonData = await response.json();

    console.log('Fetched data from Google Sheets API:', jsonData); // Logging

    res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});