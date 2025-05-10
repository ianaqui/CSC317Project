/**
 *
 * @author - Adrian Aquino
 * @file recipeController.js - Handlers for recipe routes
 *
 * 04/23/25 - Initial version
 * 04/25/25 - Added filtering
 * 04/26/25 - Added search
 *
 */

const Recipe = require('../models/Recipe');

/**
 *
 * getAllRecipes
 *
 * Method to get all recipes
 *
 * @param    req     Express request
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   renders index page
 */
exports.getAllRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find()
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.render('recipes/index', {
            title: 'All Recipes',
            recipes
        });
    } catch (error) {
        next(error);
    }
};

/**
 *
 * getRecipeById
 *
 * Method to get single recipe
 *
 * @param    req     Express request with ID
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   renders detail page
 */
exports.getRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('createdBy', 'username');

        if (!recipe) {
            return res.status(404).render('error', {
                title: 'Recipe Not Found',
                message: 'The requested recipe could not be found',
                error: { status: 404 }
            });
        }

        res.render('recipes/detail', {
            title: recipe.title,
            recipe
        });
    } catch (error) {
        next(error);
    }
};

/**
 *
 * createRecipe
 *
 * Method to create new recipe
 *
 * @param    req     Express request with form data
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   redirects to new recipe
 */
exports.createRecipe = async (req, res, next) => {
    try {
        const recipe = new Recipe({
            title: req.body.title,
            description: req.body.description,
            ingredients: JSON.parse(req.body.ingredients),
            instructions: req.body.instructions.split('\n').filter(line => line.trim() !== ''),
            prepTime: parseInt(req.body.prepTime),
            cookTime: parseInt(req.body.cookTime),
            estimatedCost: parseFloat(req.body.estimatedCost),
            category: req.body.category,
            dietaryRestrictions: {
                vegetarian: req.body.vegetarian === 'on',
                vegan: req.body.vegan === 'on',
                glutenFree: req.body.glutenFree === 'on',
                dairyFree: req.body.dairyFree === 'on',
                nutFree: req.body.nutFree === 'on'
            },
            createdBy: req.session.user.id
        });

        await recipe.save();

        res.redirect(`/recipes/${recipe._id}`);
    } catch (error) {
        next(error);
    }
};

/**
 *
 * updateRecipe
 *
 * Method to update existing recipe
 *
 * @param    req     Express request with ID and data
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   redirects to updated recipe
 */
exports.updateRecipe = async (req, res, next) => {
    try {
        let recipe = await Recipe.findById(req.params.id);

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

        recipe.title = req.body.title;
        recipe.description = req.body.description;
        recipe.ingredients = JSON.parse(req.body.ingredients);
        recipe.instructions = req.body.instructions.split('\n').filter(line => line.trim() !== '');
        recipe.prepTime = parseInt(req.body.prepTime);
        recipe.cookTime = parseInt(req.body.cookTime);
        recipe.estimatedCost = parseFloat(req.body.estimatedCost);
        recipe.category = req.body.category;
        recipe.dietaryRestrictions = {
            vegetarian: req.body.vegetarian === 'on',
            vegan: req.body.vegan === 'on',
            glutenFree: req.body.glutenFree === 'on',
            dairyFree: req.body.dairyFree === 'on',
            nutFree: req.body.nutFree === 'on'
        };

        await recipe.save();

        res.redirect(`/recipes/${recipe._id}`);
    } catch (error) {
        next(error);
    }
};

/**
 *
 * deleteRecipe
 *
 * Method to delete recipe
 *
 * @param    req     Express request with ID
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   redirects to user recipes
 */
exports.deleteRecipe = async (req, res, next) => {
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
                message: 'You do not have permission to delete this recipe',
                error: { status: 403 }
            });
        }

        await Recipe.findByIdAndDelete(req.params.id);

        res.redirect('/user/recipes');
    } catch (error) {
        next(error);
    }
};

/**
 *
 * searchRecipes
 *
 * Method to search recipes
 *
 * @param    req     Express request with search term
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   renders search results
 */
exports.searchRecipes = async (req, res, next) => {
    try {
        const searchTerm = req.query.search;

        if (!searchTerm) {
            return res.redirect('/recipes');
        }

        const recipes = await Recipe.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        }).populate('createdBy', 'username');

        res.render('recipes/search', {
            title: 'Search Results',
            searchTerm,
            recipes
        });
    } catch (error) {
        next(error);
    }
};

/**
 *
 * filterRecipes
 *
 * Method to filter recipes
 *
 * @param    req     Express request with filters
 * @param    res     Express response
 * @param    next    Next middleware
 *
 * @return   renders filtered results
 */
exports.filterRecipes = async (req, res, next) => {
    try {
        let query = {};

        // Add category filter
        if (req.body.category) {
            query.category = req.body.category;
        }

        // Add cost filter
        if (req.body.minCost || req.body.maxCost) {
            query.estimatedCost = {};
            if (req.body.minCost) {
                query.estimatedCost.$gte = parseInt(req.body.minCost);
            }
            if (req.body.maxCost) {
                query.estimatedCost.$lte = parseInt(req.body.maxCost);
            }
        }

        // Add time filter
        if (req.body.maxPrepTime) {
            query.prepTime = { $lte: parseInt(req.body.maxPrepTime) };
        }

        // Add dietary filters
        const dietaryFilters = [];
        if (req.body.vegetarian) {
            dietaryFilters.push({ 'dietaryRestrictions.vegetarian': true });
        }
        if (req.body.vegan) {
            dietaryFilters.push({ 'dietaryRestrictions.vegan': true });
        }
        if (req.body.glutenFree) {
            dietaryFilters.push({ 'dietaryRestrictions.glutenFree': true });
        }
        if (req.body.dairyFree) {
            dietaryFilters.push({ 'dietaryRestrictions.dairyFree': true });
        }
        if (req.body.nutFree) {
            dietaryFilters.push({ 'dietaryRestrictions.nutFree': true });
        }

        // Apply dietary filters
        if (dietaryFilters.length > 0) {
            query.$and = dietaryFilters;
        }

        const recipes = await Recipe.find(query)
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.render('recipes/filtered', {
            title: 'Filtered Recipes',
            recipes,
            filters: req.body
        });
    } catch (error) {
        next(error);
    }
};