/**
 * Search Functionality
 * Author: Lakshya, Adrian Aquino
 * Purpose: Handles real-time recipe search with debouncing, integrates with MongoDB API,
 *          and manages search results display and interaction.
 *
 * 5/13/25 - Modified by Adrian Aquino, updated to use MongoDB API
 */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // Clear previous timeout
    clearTimeout(searchTimeout);

    // Hide results if query is empty
    if (!query) {
      searchResults.classList.remove('active');
      return;
    }
    // Set a timeout to prevent too many API calls
    searchTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/recipe/api/search?q=${query}`);
        const data = await response.json();

        if (!data.recipes || data.recipes.length === 0) {
          searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
          searchResults.classList.add('active');
          return;
        }
        // Show only thumbnail and name
        const results = data.recipes.slice(0, 5).map(recipe => {
          // Create image URL or use placeholder
          const imageUrl = recipe.image && recipe.image.hasImage
              ? `/recipe/${recipe._id}/image`
              : '/images/recipe-placeholder.jpg';

          return `
          <a href="/user/recipes/${recipe._id}" class="search-result-item">
            <img src="${imageUrl}" alt="${recipe.title}">
            <h4>${recipe.title}</h4>
          </a>
        `;
        }).join('');
        searchResults.innerHTML = results;
        searchResults.classList.add('active');
      } catch (error) {
        console.error('Error searching recipes:', error);
        searchResults.innerHTML = '<div class="search-result-item">Error searching recipes</div>';
        searchResults.classList.add('active');
      }
    }, 300); // 300ms delay
  });
  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });
  // Handle search button click
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      searchInput.dispatchEvent(new Event('input'));
    }
  });
});