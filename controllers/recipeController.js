/**
 *
 * @author - Emma Wright, Adrian Aquino
 * @file recipeController.js - Recipe search function
 *
 * 5/13/25 - Modified by Adrian Aquino, added search function
 * 5/14/25 - Modified by Adrian Aquino, added recipe deletion
 */

//creating a recipe (emma)

const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      description,
      prepTime,
      cookTime,
      estimatedCost,
      category,
      instructions,
    } = req.body;

    const parsedInstructions = instructions.split('\n').map(s => s.trim()).filter(Boolean);

    // Ingredients
    let parsedIngredients;
    if (Array.isArray(req.body.ingredients)) {
      parsedIngredients = req.body.ingredients.map((ing) => ({
        name: ing.name,
        quantity: ing.quantity
      }));
    } else if (typeof req.body.ingredients === 'string') {
      parsedIngredients = req.body.ingredients.split('\n').map(line => {
        const [name, quantity] = line.split(':');
        return { name: name?.trim(), quantity: quantity?.trim() || '' };
      });
    }

    const dietaryRestrictions = {
      vegetarian: !!req.body.dietaryRestrictions?.vegetarian,
      vegan: !!req.body.dietaryRestrictions?.vegan,
      glutenFree: !!req.body.dietaryRestrictions?.glutenFree,
      dairyFree: !!req.body.dietaryRestrictions?.dairyFree,
      nutFree: !!req.body.dietaryRestrictions?.nutFree
    };

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      prepTime,
      cookTime,
      estimatedCost,
      category,
      dietaryRestrictions,
      createdBy: req.session.user.id
    });

    await newRecipe.save();

    res.redirect('/user/profile');
  } catch (err) {
    next(err);
  }
};

//editing a recipe 

exports.updateRecipe = async (req, res, next) => {
  try {
    const {
      title,
      description,
      prepTime,
      cookTime,
      estimatedCost,
      category,
      instructions,
    } = req.body;

    const parsedInstructions = instructions.split('\n').map(s => s.trim()).filter(Boolean);

    // Ingredients
    let parsedIngredients;
    if (Array.isArray(req.body.ingredients)) {
      parsedIngredients = req.body.ingredients.map((ing) => ({
        name: ing.name,
        quantity: ing.quantity
      }));
    } else if (typeof req.body.ingredients === 'string') {
      parsedIngredients = req.body.ingredients.split('\n').map(line => {
        const [name, quantity] = line.split(':');
        return { name: name?.trim(), quantity: quantity?.trim() || '' };
      });
    }

    const dietary = req.body.dietaryRestrictions || {};
    const dietaryRestrictions = {
      vegetarian: !!dietary.vegetarian,
      vegan: !!dietary.vegan,
      glutenFree: !!dietary.glutenFree,
      dairyFree: !!dietary.dairyFree,
      nutFree: !!dietary.nutFree
    };

    await Recipe.findByIdAndUpdate(req.params.id, {
      title,
      description,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      prepTime,
      cookTime,
      estimatedCost,
      category,
      dietaryRestrictions
    });

    res.redirect('/user/profile');
  } catch (err) {
    next(err);
  }
};


//added by Adrian Aquino

// Search recipes
exports.searchRecipes = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json({ recipes: [] });
    }

    // Find matching recipes
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({ recipes });
  } catch (err) {
    console.error('Error searching recipes:', err);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    // Check if recipe exists and belongs to the current user
    if (!recipe || recipe.createdBy.toString() !== req.session.user.id) {
      return res.status(403).send('Access denied: You cannot delete recipes you did not create');
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(req.params.id);

    // Delete any associated images
    await RecipeImage.deleteMany({ recipeId: req.params.id });

    // Redirect to profile
    res.redirect('/user/profile');
  } catch (err) {
    console.error('Error deleting recipe:', err);
    next(err);
  }
};