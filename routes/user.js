/**
 * User routes
 * Handles protected routes that require authentication
 */
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const Recipe = require('../models/Recipe');

// Controller imports
const userController = require('../controllers/userController');

// All routes in this file require authentication
router.use(isAuthenticated);

// GET /user/profile - User profile page
router.get('/profile', userController.getProfile);

// GET /user/settings - User settings page
router.get('/settings', userController.getSettings);

// POST /user/settings - Update user settings
router.post('/settings', userController.updateSettings);

// GET /user/profile-image - Get current user's profile image
router.get('/profile-image', userController.getProfileImage);

// GET /user/profile-image/:userId - Get any user's profile image by ID
router.get('/profile-image/:userId', userController.getUserProfileImage);


// GET /recipes/new-recipe - recipe creation form (emma)
router.get('/recipes/new-recipe', userController.getRecipeCreationForm);


// GET /user/recipes/:id — view one of the users own recipes

router.get('/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.createdBy.toString() !== req.session.user.id.toString()) {
      return res.status(403).send('Access denied');
    }

    res.render('user/user-recipes', {
      title: recipe.title,
      user: req.session.user,
      recipe: recipe.toObject()
    });
  } catch (err) {
    next(err);
  }
});


// GET /user/recipes/:id/edit - show edit form for users recipe
router.get('/recipes/:id/edit', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe || recipe.createdBy.toString() !== req.session.user.id.toString()) {
      return res.status(403).send('Access denied');
    }

    res.render('user/recipe-form', {
      title: 'Edit Recipe',
      user: req.session.user,
      recipe
    });
  } catch (err) {
    next(err);
  }
});



module.exports = router;