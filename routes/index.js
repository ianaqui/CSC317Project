/**
 *
 * @author - Adrian Aquino
 * @file index.js - Main application routes
 *
 * 5/13/25 - Updated to fetch recipes from MongoDB
 *
 */

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

/**
 *
 * Home page route
 * Renders the main landing page with featured recipes
 *
 */
router.get('/', async (req, res) => {
  try {
    // Fetch recipes from MongoDB
    const featuredRecipes = await Recipe.find()
        .sort({ createdAt: -1 })
        .limit(8);

    res.render('index', {
      title: 'Home',
      message: 'Welcome to PantryPal',
      featuredRecipes: featuredRecipes
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.render('index', {
      title: 'Home',
      message: 'Welcome to PantryPal',
      featuredRecipes: []
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