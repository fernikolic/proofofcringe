console.log('script.js is loaded');

let data = [];
let currentItemIndex = null; // Track the current post index
let clickCount = 0; // Counter for tracking the number of clicks
let interstitialIntervals = [15, 30]; // First after 15, then after 30 clicks
let interstitialIndex = 0; // Track which interval we're on

// Check if the user opted out of seeing the interstitial
const interstitialOptOut = localStorage.getItem('hideInterstitial') === 'true';

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
      data = jsonData.values.map((row, index) => ({
        rowIndex: index, // Track the row index
        headline: row[0] || 'No headline',
        screenshot: row[1] || '',
        description: row[2] || 'No description available.',
        url: row[3] || '#',
        outlet: row[4] || 'No date available', // New Date column
        date: row[5] || 'No outlet available', // New Outlet column
        upvotes: parseInt(row[6] || '0', 10),  // Upvotes column
        downvotes: parseInt(row[7] || '0', 10), // Downvotes column
        slug: row[6] || 'no-slug' // Use slug from Column G, or provide a fallback
      }));

      console.log('Processed data with slugs:', data);
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
    console.error('No data available to display.');
    return;
  }

  currentItemIndex = getRandomIndex();
  const item = data[currentItemIndex];
  console.log('Item to display:', item);

  // Update the URL with the slug
  const newUrl = `${window.location.origin}/${item.slug}`;
  history.pushState({}, '', newUrl); // This changes the URL without reloading the page

  const screenshot = document.getElementById('screenshot');
  const description = document.getElementById('description');
  const dateElement = document.getElementById('date');
  const outletElement = document.getElementById('outlet');

  if (!screenshot || !description || !dateElement || !outletElement) {
    console.error('One or more elements are missing in the DOM');
    return;
  }

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

    screenshot.classList.add('show');
    description.classList.add('show');
    dateElement.classList.add('show');
    outletElement.classList.add('show');

    console.log('Content updated on the page.');
  }, 500);
}

function handleVote(type) {
  if (currentItemIndex === null) return;

  const currentItem = data[currentItemIndex];

  // Ensure valid upvote and downvote numbers
  if (!currentItem.upvotes) currentItem.upvotes = 0;
  if (!currentItem.downvotes) currentItem.downvotes = 0;

  // Update the votes
  if (type === 'upvote') {
    currentItem.upvotes += 1;
  } else if (type === 'downvote') {
    currentItem.downvotes += 1;
  }

  console.log(`Updated votes: Upvotes - ${currentItem.upvotes}, Downvotes - ${currentItem.downvotes}`);

  clickCount++; // Increment the click counter
  console.log(`Click count: ${clickCount}`);

  // Check if the user opted out of interstitial
  if (!interstitialOptOut) {
    if (clickCount >= interstitialIntervals[interstitialIndex]) {
      showInterstitial(); // Show the interstitial after the interval
      interstitialIndex = 1; // Set to next interval (30 clicks)
      clickCount = 0; // Reset the click counter after showing the interstitial
    } else {
      displayContent();
    }
  } else {
    displayContent();
  }

  // Save the updated votes to Firebase Realtime Database
  saveVotes(currentItem.rowIndex, currentItem.upvotes, currentItem.downvotes);
}

// Show the interstitial
function showInterstitial() {
  document.getElementById('interstitial').style.display = 'block';
}

// Close the interstitial and continue voting
function closeInterstitial() {
  document.getElementById('interstitial').style.display = 'none';
  displayContent(); // Load the next content after closing
}

// "Never Show Again" button logic
function neverShowInterstitial() {
  localStorage.setItem('hideInterstitial', 'true'); // Save the opt-out preference in localStorage
  closeInterstitial();
}

// Make sure DOM is loaded before adding event listeners
document.addEventListener("DOMContentLoaded", async () => {
  const seeAnotherButton = document.getElementById('see-another');
  const thumbsUpButton = document.getElementById('thumbs-up');
  const thumbsDownButton = document.getElementById('thumbs-down');
  const closeInterstitialButton = document.getElementById('close-interstitial');
  const neverShowInterstitialButton = document.getElementById('never-show-interstitial');

  if (seeAnotherButton) {
    seeAnotherButton.addEventListener('click', displayContent);
  }

  if (thumbsUpButton) {
    thumbsUpButton.addEventListener('click', () => handleVote('upvote'));
  }

  if (thumbsDownButton) {
    thumbsDownButton.addEventListener('click', () => handleVote('downvote'));
  }

  if (closeInterstitialButton) {
    closeInterstitialButton.addEventListener('click', closeInterstitial);
  }

  if (neverShowInterstitialButton) {
    neverShowInterstitialButton.addEventListener('click', neverShowInterstitial);
  }

  await fetchData();
  displayContent();
});

async function saveVotes(row, upvotes, downvotes) {
  console.log('Saving votes to Firebase:', { row, upvotes, downvotes });

  try {
    const voteRef = firebase.database().ref('votes/' + row); // Reference to specific vote row
    await voteRef.set({
      upvotes: upvotes || 0, // Ensure valid number
      downvotes: downvotes || 0
    });
    console.log('Vote saved successfully!', { row, upvotes, downvotes });
  } catch (error) {
    console.error('Error saving votes:', error);
  }
}

// Function to check if the device is mobile based on screen size and user agent
function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check for common mobile device user agents
  const isMobileUserAgent = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent.toLowerCase());

  // Also check if screen width is less than 768px (typical threshold for mobile)
  const isMobileScreen = window.innerWidth <= 768;

  return isMobileUserAgent && isMobileScreen;
}

// Function to show the popup for mobile devices
function showMobilePopup() {
  const mobilePopup = document.getElementById('mobile-popup');
  if (isMobileDevice()) {
      mobilePopup.style.display = 'block';
  }
}

// Close the popup
function closeMobilePopup() {
  document.getElementById('mobile-popup').style.display = 'none';
}

// Check if the user is on a mobile device when the page loads
document.addEventListener("DOMContentLoaded", function() {
  showMobilePopup();
});

const visitAnywayButton = document.getElementById('visit-anyway');
if (visitAnywayButton) {
  visitAnywayButton.addEventListener('click', closeMobilePopup);
}