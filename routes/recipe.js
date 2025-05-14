/**
 *
 * @author - Lakshya, Adrian Aquino
 * @file recipe.js - Recipe related routes
 *
 * 5/13/25 - Modified by Adrian Aquino, MongoDB API endpoints
 * 5/14/25 - Modified by Adrian Aquino, Added route for recipe deletion
 * 5/14/25 - Modified by Adrian Aquino, Separated TheMealDB routes from MongoDB routes
 */

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const recipeController = require('../controllers/recipeController');

/**
 *
 * External Recipe Routes (TheMealDB API)
 * These routes handle fetching and displaying recipes from TheMealDB API
 *
 */
router.get('/external/:id', recipeController.getExternalRecipe);

/**
 *
 * User Recipe Routes (MongoDB)
 * These routes handle user-created recipes stored in MongoDB
 *
 */

// Get a specific recipe
router.get('/:id', recipeController.getUserRecipe);

// Create a new recipe (requires authentication)
router.post('/', isAuthenticated, recipeController.createRecipe);

// Update an existing recipe (requires authentication)
router.put('/:id', isAuthenticated, recipeController.updateRecipe);

// Delete a recipe (requires authentication)
router.delete('/:id', isAuthenticated, recipeController.deleteRecipe);

// Get recipe image
router.get('/:id/image', recipeController.getRecipeImage);

/**
 *
 * Recipe API Routes
 * JSON APIs for recipe search and filtering
 *
 */

// Recipe search API
router.get('/api/search', recipeController.searchRecipes);

/**
 *
 * Filtered recipes API
 * Implements advanced filtering by price, prep time, and dietary restrictions
 *
 */
router.get('/api/recipes', async (req, res) => {
  try {
    // Extract filter parameters
    const { minPrice, maxPrice, prepTime, dietary } = req.query;

    // Build query object
    const query = {};

    // Apply price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.estimatedCost = {};
      if (minPrice !== undefined) query.estimatedCost.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.estimatedCost.$lte = Number(maxPrice);
    }

    // Apply prep time filter
    if (prepTime) {
      const prepTimeValues = Array.isArray(prepTime) ? prepTime : [prepTime];

      if (prepTimeValues.includes('quick')) {
        query.prepTime = query.prepTime || {};
        query.prepTime.$lte = 30;
      } else if (prepTimeValues.includes('medium')) {
        query.prepTime = query.prepTime || {};
        query.prepTime.$gt = 30;
        query.prepTime.$lte = 60;
      } else if (prepTimeValues.includes('long')) {
        query.prepTime = query.prepTime || {};
        query.prepTime.$gt = 60;
      }
    }

    // Apply dietary filters
    if (dietary) {
      const dietaryValues = Array.isArray(dietary) ? dietary : [dietary];

      dietaryValues.forEach(value => {
        switch(value) {
          case 'vegetarian':
            query['dietaryRestrictions.vegetarian'] = true;
            break;
          case 'vegan':
            query['dietaryRestrictions.vegan'] = true;
            break;
          case 'gluten-free':
            query['dietaryRestrictions.glutenFree'] = true;
            break;
          case 'dairy-free':
            query['dietaryRestrictions.dairyFree'] = true;
            break;
          case 'nut-free':
            query['dietaryRestrictions.nutFree'] = true;
            break;
        }
      });
    }

    // Fetch recipes with the query
    const recipes = await Recipe.find(query)
        .sort({ createdAt: -1 })
        .limit(50);

    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

/**
 *
 * Featured recipes API
 * Returns the most recently created recipes
 *
 */
router.get('/api/featured', async (req, res) => {
  try {
    // Get most recent recipes
    const recipes = await Recipe.find()
        .sort({ createdAt: -1 })
        .limit(8);

    res.json(recipes);
  } catch (err) {
    console.error('Error fetching featured recipes:', err);
    res.status(500).json({ error: 'Failed to fetch featured recipes' });
  }
});

module.exports = router;