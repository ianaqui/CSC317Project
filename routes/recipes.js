/**
 *
 * @author - Adrian Aquino
 * @file recipes.js - Express routes for recipes
 *
 * 04/24/25 - Initial version
 * 04/26/25 - Added filter routes
 * 04/28/25 - Added auth checks
 *
 */

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const recipeController = require('../controllers/recipeController');
const Recipe = require('../models/Recipe');

/**
 *
 * Public Routes
 *
 * No auth required
 */

// Show all recipes
router.get('/', recipeController.getAllRecipes);

// Search recipes
router.get('/search', recipeController.searchRecipes);

// Filter form
router.get('/filter', (req, res) => {
    res.render('recipes/filter', { title: 'Filter Recipes' });
});

// Process filter
router.post('/filter', recipeController.filterRecipes);

// Single recipe
router.get('/:id', recipeController.getRecipeById);

/**
 *
 * Protected Routes
 *
 * Auth required
 */

// Create form
router.get('/new', isAuthenticated, (req, res) => {
    res.render('recipes/create', { title: 'Create Recipe' });
});

// Process create
router.post('/new', isAuthenticated, recipeController.createRecipe);

/**
 *
 * getEditForm
 *
 * Display edit form
 *
 * @param    req     Express request
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   renders edit form
 */
router.get('/:id/edit', isAuthenticated, async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).render('error', {
                title: 'Recipe Not Found',
                message: 'The requested recipe could not be found',
                error: { status: 404 }
            });
        }

        if (recipe.createdBy.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                title: 'Access Denied',
                message: 'You do not have permission to edit this recipe',
                error: { status: 403 }
            });
        }

        res.render('recipes/edit', {
            title: 'Edit Recipe',
            recipe
        });
    } catch (error) {
        next(error);
    }
});

// Process edit
router.post('/:id/edit', isAuthenticated, recipeController.updateRecipe);

// Process delete
router.post('/:id/delete', isAuthenticated, recipeController.deleteRecipe);

module.exports = router;