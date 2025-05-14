/**
 * Recipe Routes
 * Author: Lakshya, Adrian Aquino
 * Purpose: Handles recipe-related routes, including fetching individual recipe details
 *          from TheMealDB API and rendering the recipe detail page.
 *
 *
 * 5/13/25 - Modified by Adrian Aquino, MongoDB API endpoints
 * 5/14/25 - Modified by Adrian Aquino, Added route for recipe deletion
 */

const express = require('express');
const router = express.Router();

//added by emma
const { isAuthenticated } = require('../middlewares/auth');
const recipeController = require('../controllers/recipeController');
//up to here


router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${req.params.id}`);
    const data = await response.json();
    
    if (!data.meals || data.meals.length === 0) {
      return res.status(404).render('error', {
        message: 'Recipe not found',
        error: { status: 404 },
        title: 'Recipe Not Found'
      });
    }

    // Generate a random price between $5 and $25
    const price = (Math.random() * 20 + 5).toFixed(2);
    
    res.render('recipe', {
      recipe: data.meals[0],
      price: price,
      title: data.meals[0].strMeal
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).render('error', {
      message: 'Error loading recipe',
      error: { status: 500 },
      title: 'Error'
    });
  }
});

//added by emma
router.post('/', isAuthenticated, recipeController.createRecipe);
router.put('/:id', isAuthenticated, recipeController.updateRecipe);


module.exports = router;


//added by Adrian

// Recipe search API
router.get('/api/search', recipeController.searchRecipes);
// Delete recipe
router.delete('/:id', isAuthenticated, recipeController.deleteRecipe);

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
