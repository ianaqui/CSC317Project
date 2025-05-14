/**
 *
 * @author - Adrian Aquino
 * @file index.js - Homepage JavaScript
 *
 * 5/13/25 - Initial implementation for MongoDB integration
 * 5/14/25 - Modified by Adrian Aquino, updated to handle both recipe sources
 *
 */

/**
 *
 * fetchFeaturedRecipes
 *
 * Fetches featured recipes from MongoDB API and external TheMealDB API
 *
 */
async function fetchFeaturedRecipes() {
    const recipesGrid = document.getElementById('recipes-grid');
    const loadingSpinner = document.getElementById('loading-spinner');

    try {
        // Fetch MongoDB recipes from our API
        const response = await fetch('/recipe/api/featured');
        const mongodbRecipes = await response.json();

        // Fetch TheMealDB recipes
        const externalRecipes = [];
        for (let i = 0; i < 4; i++) {
            try {
                const mealResponse = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
                const mealData = await mealResponse.json();
                if (mealData.meals && mealData.meals.length > 0) {
                    // Add a flag to identify as external recipe
                    mealData.meals[0].isExternal = true;
                    // Generate a random price
                    mealData.meals[0].price = (Math.random() * 20 + 5).toFixed(2);
                    externalRecipes.push(mealData.meals[0]);
                }
            } catch (apiErr) {
                console.error('Error fetching external recipe:', apiErr);
                // Continue with other recipes if one fails
            }
        }

        // Combine the recipes
        const allRecipes = [...mongodbRecipes, ...externalRecipes];

        // Clear loading spinner
        loadingSpinner.style.display = 'none';

        if (allRecipes.length === 0) {
            recipesGrid.innerHTML = '<p>No recipes found. Be the first to add one!</p>';
            return;
        }

        // Populate the grid with recipe cards
        recipesGrid.innerHTML = allRecipes.map(recipe => createRecipeCard(recipe)).join('');
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
 * Creates HTML for a recipe card, handling both MongoDB and TheMealDB recipes
 *
 * @param    recipe    Recipe data object
 *
 * @return   HTML string for recipe card
 */
function createRecipeCard(recipe) {
    // Check if this is an external recipe (from TheMealDB) or internal (MongoDB)
    const isExternal = recipe.isExternal || recipe.idMeal;

    // Handle external recipe (TheMealDB)
    if (isExternal) {
        const price = recipe.price || (Math.random() * 20 + 5).toFixed(2);
        const tags = recipe.strTags ? recipe.strTags.split(',').slice(0, 2) : [];

        return `
            <a href="/recipe/external/${recipe.idMeal}" class="recipe-card">
                <div class="recipe-image">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                </div>
                <div class="recipe-info">
                    <h3>${recipe.strMeal}</h3>
                    <div class="recipe-meta">
                        <p class="recipe-price">$${price}</p>
                        <div class="recipe-category">
                            <span>${recipe.strCategory || ''}</span>
                            ${tags.map(tag => `<span>${tag.trim()}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    // Handle internal recipe (MongoDB)
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
    const imageUrl = recipe.hasImage
        ? `/recipe/${recipe._id}/image`
        : '/images/recipe-placeholder.jpg';

    return `
        <a href="/recipe/${recipe._id}" class="recipe-card">
            <div class="recipe-image">
                <img src="${imageUrl}" alt="${recipe.title}">
            </div>
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <p class="recipe-price">$${recipe.estimatedCost.toFixed(2)}</p>
                    <div class="recipe-category">
                        <span>${recipe.category || ''}</span>
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