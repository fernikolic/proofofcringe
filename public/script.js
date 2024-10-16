console.log('script.js is loaded');

let data = [];

async function fetchData() {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets/1L_8B_G50Y0oHJ46IWmspRYS5l_VcWr_MU5qR9lBcMQs/values/Sheet1!A2:F?key=AIzaSyC3oGB9sdUrokD-OrMdx0ol0TBdhf2gudQ'; // Full API URL with new columns for Date and Outlet

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
        date: row[5] || 'No outlet available' // New Outlet column
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

  const randomIndex = getRandomIndex();
  console.log('Random index selected:', randomIndex);

  const item = data[randomIndex];
  console.log('Item to display:', item);

  const screenshot = document.getElementById('screenshot');
  const description = document.getElementById('description');
  const dateElement = document.getElementById('date');
  const outletElement = document.getElementById('outlet');

  screenshot.classList.remove('show');
  description.classList.remove('show');
  dateElement.classList.remove('show');
  outletElement.classList.remove('show');

  setTimeout(() => {
    screenshot.src = item.screenshot;
    screenshot.alt = item.headline;

    description.innerHTML = `<strong>Cringe-worthy quote:</strong> ${item.description}`;
    dateElement.textContent = `Date: ${item.date}`;
    outletElement.textContent = `Outlet: ${item.outlet}`;

    screenshot.classList.add('show');
    description.classList.add('show');
    dateElement.classList.add('show');
    outletElement.classList.add('show');

    console.log('Content updated on the page.');
  }, 500);
}

document.getElementById('see-another').addEventListener('click', displayContent);

window.onload = async () => {
  await fetchData();
  displayContent();
};