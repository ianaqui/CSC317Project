/**
 *
 * @author - Adrian Aquino
 * @file index.js - Homepage JavaScript
 *
 * 5/13/25 - Initial implementation for MongoDB integration
 *
 */

/**
 *
 * fetchFeaturedRecipes
 *
 * Fetches featured recipes from MongoDB API
 *
 */
async function fetchFeaturedRecipes() {
    const recipesGrid = document.getElementById('recipes-grid');
    const loadingSpinner = document.getElementById('loading-spinner');

    try {
        // Fetch from our API
        const response = await fetch('/recipe/api/featured');
        const recipes = await response.json();

        // Clear loading spinner
        loadingSpinner.style.display = 'none';

        if (recipes.length === 0) {
            recipesGrid.innerHTML = '<p>No recipes found. Be the first to add one!</p>';
            return;
        }

        // Populate the grid with recipe cards
        recipesGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
    } catch (error) {
        console.error('Error fetching recipes:', error);
        loadingSpinner.style.display = 'none';
        recipesGrid.innerHTML = '<p class="error-message">Failed to load recipes. Please try again later.</p>';
    }
}

/**
 *
 * createRecipeCard
 *
 * Creates HTML for a recipe card
 *
 * @param    recipe    Recipe data object
 *
 * @return   HTML string for recipe card
 */
function createRecipeCard(recipe) {
    // Get dietary tags
    const dietaryTags = [];
    if (recipe.dietaryRestrictions) {
        if (recipe.dietaryRestrictions.vegetarian) dietaryTags.push('vegetarian');
        if (recipe.dietaryRestrictions.vegan) dietaryTags.push('vegan');
        if (recipe.dietaryRestrictions.glutenFree) dietaryTags.push('gluten-free');
        if (recipe.dietaryRestrictions.dairyFree) dietaryTags.push('dairy-free');
        if (recipe.dietaryRestrictions.nutFree) dietaryTags.push('nut-free');
    }

    // Create image URL or use placeholder
    const imageUrl = recipe.image && recipe.image.hasImage
        ? `/recipe/${recipe._id}/image`
        : '/images/recipe-placeholder.jpg';

    return `
        <a href="/user/recipes/${recipe._id}" class="recipe-card">
            <div class="recipe-image">
                <img src="${imageUrl}" alt="${recipe.title}">
            </div>
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <p class="recipe-price">$${recipe.estimatedCost.toFixed(2)}</p>
                    <div class="recipe-category">
                        ${dietaryTags.slice(0, 2).map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        </a>
    `;
}

/**
 *
 * applyFilters
 *
 * Applies filters to recipe list based on user selection
 *
 */
async function applyFilters() {
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;

    // Get selected prep time filters
    const prepTimeFilters = Array.from(document.querySelectorAll('input[name="prep-time"]:checked'))
        .map(input => input.value);

    // Get selected dietary filters
    const dietaryFilters = Array.from(document.querySelectorAll('input[name="dietary"]:checked'))
        .map(input => input.value);

    // Build query parameters
    const params = new URLSearchParams();
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    prepTimeFilters.forEach(filter => params.append('prepTime', filter));
    dietaryFilters.forEach(filter => params.append('dietary', filter));

    try {
        // Show loading indicator
        const recipesGrid = document.getElementById('filtered-recipes-grid');
        recipesGrid.innerHTML = '<div class="loading-spinner">Filtering recipes...</div>';

        // Fetch filtered recipes
        const response = await fetch(`/recipe/api/recipes?${params.toString()}`);
        const recipes = await response.json();

        // Update UI with filtered recipes
        if (recipes.length === 0) {
            recipesGrid.innerHTML = '<p class="no-results">No recipes match your filters. Try adjusting your criteria.</p>';
        } else {
            recipesGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
        }

        // Reset pagination to page 1
        currentPage = 1;
        updatePagination(recipes.length);
    } catch (error) {
        console.error('Error applying filters:', error);
        document.getElementById('filtered-recipes-grid').innerHTML =
            '<p class="error-message">Failed to apply filters. Please try again later.</p>';
    }
}

// Initialize functionality when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchFeaturedRecipes();

    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
});