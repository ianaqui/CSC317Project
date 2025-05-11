/**
 * Recipe Routes
 * Author: Lakshya
 * Purpose: Handles recipe-related routes, including fetching individual recipe details
 *          from TheMealDB API and rendering the recipe detail page.
 */

const express = require('express');
const router = express.Router();

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

module.exports = router; 