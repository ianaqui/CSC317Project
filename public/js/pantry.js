/**
 * Pantry Section Functionality
 * Author: Lakshya
 * Purpose: Handles recipe filtering, pagination, and dynamic content loading
 *          for the pantry section. Integrates with TheMealDB API.
 */

let currentPage = 1;
const recipesPerPage = 10;
let allRecipes = [];
let filteredRecipes = [];

async function fetchRecipes() {
    try {
        // Fetch 50 recipes initially (5 pages worth)
        const recipes = [];
        for (let i = 0; i < 50; i++) {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            recipes.push(data.meals[0]);
        }
        allRecipes = recipes;
        filteredRecipes = recipes;
        displayRecipes();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        document.getElementById('filtered-recipes-grid').innerHTML = 
            '<p class="error-message">Failed to load recipes. Please try again later.</p>';
    }
}

function applyFilters() {
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || 100;
    
    // Get selected prep time filters
    const prepTimeFilters = Array.from(document.querySelectorAll('input[name="prep-time"]:checked'))
        .map(input => input.value);
    
    // Get selected dietary filters
    const dietaryFilters = Array.from(document.querySelectorAll('input[name="dietary"]:checked'))
        .map(input => input.value);

    // Filter recipes
    filteredRecipes = allRecipes.filter(recipe => {
        // Price filter (using random price for demo)
        const price = (Math.random() * 20 + 5).toFixed(2);
        if (price < minPrice || price > maxPrice) return false;

        // Prep time filter (using tags for demo)
        if (prepTimeFilters.length > 0) {
            const prepTime = recipe.strTags ? recipe.strTags.toLowerCase() : '';
            if (!prepTimeFilters.some(filter => prepTime.includes(filter))) return false;
        }

        // Dietary filters
        if (dietaryFilters.length > 0) {
            const tags = recipe.strTags ? recipe.strTags.toLowerCase() : '';
            if (!dietaryFilters.some(filter => tags.includes(filter))) return false;
        }

        return true;
    });

    currentPage = 1;
    displayRecipes();
}

function displayRecipes() {
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToShow = filteredRecipes.slice(startIndex, endIndex);
    
    const recipesGrid = document.getElementById('filtered-recipes-grid');
    recipesGrid.innerHTML = recipesToShow.map(recipe => createRecipeCard(recipe)).join('');
    
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    let paginationHTML = `
        <div class="pagination">
            <button class="pagination-btn" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="changePage(${currentPage - 1})">
                Previous
            </button>
            <span class="page-info">Page ${currentPage} of ${totalPages}</span>
            <button class="pagination-btn" 
                    ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="changePage(${currentPage + 1})">
                Next
            </button>
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(newPage) {
    if (newPage < 1 || newPage > Math.ceil(filteredRecipes.length / recipesPerPage)) return;
    currentPage = newPage;
    displayRecipes();
    window.scrollTo({ top: document.getElementById('filtered-recipes-grid').offsetTop - 100, behavior: 'smooth' });
}

function createRecipeCard(recipe) {
    const price = (Math.random() * 20 + 5).toFixed(2);
    const tags = recipe.strTags ? recipe.strTags.split(',').slice(0, 2) : [];
    
    return `
        <a href="/recipe/${recipe.idMeal}" class="recipe-card">
            <div class="recipe-image">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            </div>
            <div class="recipe-info">
                <h3>${recipe.strMeal}</h3>
                <div class="recipe-meta">
                    <p class="recipe-price">$${price}</p>
                    <div class="recipe-category">
                        ${tags.map(tag => `<span>${tag.trim()}</span>`).join('')}
                    </div>
                </div>
            </div>
        </a>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
}); 