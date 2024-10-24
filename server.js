// server.js

const express = require('express');
const fetch = require('node-fetch');
const admin = require("firebase-admin");
const path = require('path');

const app = express();
const port = 3001;

// Use express.json() to parse incoming requests with JSON payloads
app.use(express.json());

// Initialize Firebase Admin SDK with service account
var serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://proof-of-cringe-72a1a-default-rtdb.firebaseio.com"
});

const db = admin.database();  // Use Firebase Realtime Database

// API route to fetch data from Google Sheets
app.get('/api/data', async (req, res) => {
  const apiKey = 'AIzaSyC3oGB9sdUrokD-OrMdx0ol0TBdhf2gudQ';
  const spreadsheetId = '1L_8B_G50Y0oHJ46IWmspRYS5l_VcWr_MU5qR9lBcMQs';
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

// API route to save votes
app.post('/api/save-vote', async (req, res) => {
  const { row, upvotes, downvotes } = req.body;

  // Log incoming vote data
  console.log(`Received vote request: Row - ${row}, Upvotes - ${upvotes}, Downvotes - ${downvotes}`);

  try {
    // Reference to the specific vote row in Firebase Realtime Database
    const voteRef = db.ref('votes/' + row);

    // Retrieve current votes from Firebase
    const snapshot = await voteRef.once('value');
    const currentVotes = snapshot.val() || { upvotes: 0, downvotes: 0 };

    // Log current vote data in Firebase before update
    console.log(`Current votes in Firebase for row ${row}:`, currentVotes);

    // Update the votes
    const updatedUpvotes = (currentVotes.upvotes || 0) + (upvotes || 0);
    const updatedDownvotes = (currentVotes.downvotes || 0) + (downvotes || 0);

    // Save the updated votes in Firebase
    await voteRef.set({
      upvotes: updatedUpvotes,
      downvotes: updatedDownvotes
    });

    // Log after saving to Firebase
    console.log(`Updated votes saved in Firebase for row ${row}: Upvotes - ${updatedUpvotes}, Downvotes - ${updatedDownvotes}`);

    // Send response
    res.status(200).json({
      message: 'Vote saved successfully!',
      upvotes: updatedUpvotes,
      downvotes: updatedDownvotes
    });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ error: 'Failed to save vote' });
  }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});