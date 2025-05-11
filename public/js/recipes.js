/**
 * Recipe Card Component
 * Author: Lakshya
 * Purpose: Utility function for creating recipe card HTML elements with consistent
 *          styling and data display format.
 */

function createRecipeCard(recipe) {
  const price = (Math.random() * 20 + 5).toFixed(2);
  const tags = recipe.strTags ? recipe.strTags.split(',').slice(0, 2) : [];
  
  return `
    <a href="/recipe/${recipe.idMeal}" class="recipe-card">
      <div class="recipe-image">
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
      </div>
      <div class="recipe-info">
        <p class="recipe-price">$${price}</p>
        <h3>${recipe.strMeal}</h3>
        <div class="recipe-category">
          ${tags.map(tag => `<span>${tag.trim()}</span>`).join('')}
        </div>
      </div>
    </a>
  `;
} 