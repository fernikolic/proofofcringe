console.log('script.js is loaded');

let data = [];
let currentItemIndex = null; // Track the current post index

async function fetchData() {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets/1L_8B_G50Y0oHJ46IWmspRYS5l_VcWr_MU5qR9lBcMQs/values/Sheet1!A2:H?key=AIzaSyC3oGB9sdUrokD-OrMdx0ol0TBdhf2gudQ'; // Add columns for votes

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const jsonData = await response.json();

    console.log('Data received from server:', jsonData); // Logging

    if (jsonData.values) {
      data = jsonData.values.map(row => ({
        headline: row[0] || 'No headline',
        screenshot: row[1] || '',
        description: row[2] || 'No description available.',
        url: row[3] || '#',
        outlet: row[4] || 'No date available', // New Date column
        date: row[5] || 'No outlet available', // New Outlet column
        upvotes: parseInt(row[6] || '0', 10),  // Upvotes column
        downvotes: parseInt(row[7] || '0', 10) // Downvotes column
      }));

      console.log('Processed data:', data);
    } else {
      console.error('No data found in the response.');
      data = [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to load data. Please try again later.');
  }
}

function getRandomIndex() {
  return Math.floor(Math.random() * data.length);
}

function displayContent() {
  console.log('displayContent() called');
  console.log('Data array length:', data.length);

  if (data.length === 0) {
    document.getElementById('headline-link').textContent = 'No data available.';
    return;
  }

  currentItemIndex = getRandomIndex();
  const item = data[currentItemIndex];
  console.log('Item to display:', item);

  const screenshot = document.getElementById('screenshot');
  const description = document.getElementById('description');
  const dateElement = document.getElementById('date');
  const outletElement = document.getElementById('outlet');
  const upvotesCount = document.getElementById('upvotes-count');
  const downvotesCount = document.getElementById('downvotes-count');

  screenshot.classList.remove('show');
  description.classList.remove('show');
  dateElement.classList.remove('show');
  outletElement.classList.remove('show');

  setTimeout(() => {
    screenshot.src = item.screenshot;
    screenshot.alt = item.headline;

    description.innerHTML = `<strong>Cringe-worthy quote:</strong> ${item.description}`;
    dateElement.textContent = `Date: ${item.date}`;
    outletElement.innerHTML = `Outlet: ${item.outlet} <a href="${item.url}" target="_blank"><i class="fas fa-external-link-alt"></i></a>`;

    upvotesCount.textContent = item.upvotes;
    downvotesCount.textContent = item.downvotes;

    screenshot.classList.add('show');
    description.classList.add('show');
    dateElement.classList.add('show');
    outletElement.classList.add('show');

    console.log('Content updated on the page.');
  }, 500);
}

function handleVote(type) {
  if (currentItemIndex === null) return;

  if (type === 'upvote') {
    data[currentItemIndex].upvotes += 1;
  } else if (type === 'downvote') {
    data[currentItemIndex].downvotes += 1;
  }

  displayContent();

  // Save the updated votes to Firebase Realtime Database
  saveVotes(currentItemIndex, data[currentItemIndex].upvotes, data[currentItemIndex].downvotes);
}

// Make sure DOM is loaded before adding event listeners
document.addEventListener("DOMContentLoaded", async () => {
  const seeAnotherButton = document.getElementById('see-another');
  const thumbsUpButton = document.getElementById('thumbs-up');
  const thumbsDownButton = document.getElementById('thumbs-down');

  if (seeAnotherButton) {
      seeAnotherButton.addEventListener('click', displayContent);
  }

  if (thumbsUpButton) {
      thumbsUpButton.addEventListener('click', () => handleVote('upvote'));
  }

  if (thumbsDownButton) {
      thumbsDownButton.addEventListener('click', () => handleVote('downvote'));
  }

  await fetchData();
  displayContent();
});

async function saveVotes(row, upvotes, downvotes) {
  console.log('Saving votes to Firebase:', { row, upvotes, downvotes });

  try {
    const voteRef = firebase.database().ref('votes/' + row);
    await voteRef.set({
      upvotes: upvotes,
      downvotes: downvotes
    });
    console.log('Vote saved successfully!');
  } catch (error) {
    console.error('Error saving votes:', error);
  }
}