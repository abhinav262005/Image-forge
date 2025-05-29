const API_KEY = 'J4R6KjKrKSPB8owi6kDiO7suLW5wR8wgIGmTanOuYyM'; // Replace with your Unsplash API key
const BASE_URL = 'https://api.unsplash.com/search/photos';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const errorMessage = document.getElementById('error-message');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const loadingSpinner = document.getElementById('loading-spinner');

let currentPage = 1;
let currentQuery = '';

// Fetch images from Unsplash API
async function fetchImages(query, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}?query=${query}&client_id=${API_KEY}&per_page=20&page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching images:', error);
        errorMessage.textContent = 'Failed to fetch images. Please try again later.';
        return [];
    }
}

// Display images in the results container
function displayImages(images) {
    if (images.length === 0) {
        errorMessage.textContent = 'No results found.';
        return;
    }
    images.forEach(image => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description;

        // Create a caption container
        const caption = document.createElement('p');
        caption.className = 'caption';
        caption.textContent = image.alt_description || 'No caption available';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.className = 'download-button';
        downloadButton.addEventListener('click', () => {
            window.open(image.links.download, '_blank');
        });

        imageCard.appendChild(imgElement);
        imageCard.appendChild(caption);
        imageCard.appendChild(downloadButton);
        resultsContainer.appendChild(imageCard);
    });
}

// Handle search button click
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        errorMessage.textContent = '';
        resultsContainer.innerHTML = ''; // Clear previous results
        currentQuery = query;
        currentPage = 1;
        loadingSpinner.style.display = 'flex';
        const images = await fetchImages(query);
        loadingSpinner.style.display = 'none';
        displayImages(images);
    } else {
        errorMessage.textContent = 'Please enter a search term.';
    }
});

// Infinite scrolling
window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadingSpinner.style.display = 'flex';
        currentPage++;
        const images = await fetchImages(currentQuery, currentPage);
        loadingSpinner.style.display = 'none';
        displayImages(images);
    }
});

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});