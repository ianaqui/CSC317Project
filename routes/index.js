/**
 *
 * @author - Adrian Aquino
 * @file index.js - Main application routes
 *
 * 5/13/25 - Updated to fetch recipes from MongoDB
 * 5/14/25 - Clarified API integration
 *
 */

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

/**
 *
 * Home page route
 * Renders the main landing page with featured recipes
 * Fetches user-created recipes from MongoDB and external recipes from TheMealDB
 *
 */
router.get('/', async (req, res) => {
  try {
    // Fetch user-created recipes from MongoDB
    const userCreatedRecipes = await Recipe.find()
        .sort({ createdAt: -1 })
        .limit(4);

    // Fetch external recipes from TheMealDB API
    const externalRecipes = [];
    try {
      for (let i = 0; i < 4; i++) {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          // Add a flag to identify as external recipe
          data.meals[0].isExternal = true;
          // Generate a random price
          data.meals[0].price = (Math.random() * 20 + 5).toFixed(2);
          externalRecipes.push(data.meals[0]);
        }
      }
    } catch (apiErr) {
      console.error('Error fetching external recipes:', apiErr);
      // Continue with MongoDB recipes if TheMealDB API fails
    }

    // Combine the recipes
    const allRecipes = [...userCreatedRecipes, ...externalRecipes];

    res.render('index', {
      title: 'Home',
      message: 'Welcome to PantryPal',
      featuredRecipes: allRecipes,
      userCreatedRecipes: userCreatedRecipes,
      externalRecipes: externalRecipes
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.render('index', {
      title: 'Home',
      message: 'Welcome to PantryPal',
      featuredRecipes: [],
      userCreatedRecipes: [],
      externalRecipes: []
    });
  }
});

/**
 *
 * About page route
 * Displays information about the application
 *
 */
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    message: 'Learn about this application'
  });
});

module.exports = router;