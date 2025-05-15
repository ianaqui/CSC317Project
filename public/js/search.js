/**
 *
 * @author - Lakshya, Adrian Aquino
 * @file search.js - Real-time search functionality
 *
 * 5/13/25 - Modified by Adrian Aquino, updated to use MongoDB API
 * 5/14/25 - Modified by Adrian Aquino, added support for dual-source search results
 *
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
        const results = data.recipes.slice(0, 10).map(recipe => {
          // Handle external recipes from TheMealDB
          if (recipe.isExternal) {
            return `
              <a href="/recipe/external/${recipe._id}" class="search-result-item">
                <img src="${recipe.externalThumbnail}" alt="${recipe.title}">
                <h4>${recipe.title}</h4>
              </a>
            `;
          }

          // Handle MongoDB recipes
          // Create image URL or use placeholder
          const imageUrl = recipe.hasImage
              ? `/recipe/${recipe._id}/image`
              : '/images/recipe-placeholder.jpg';

          return `
            <a href="/recipe/${recipe._id}" class="search-result-item">
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