/**
 *
 * @author - Emma Wright, Adrian Aquino
 * @file recipeController.js - Recipe controller functions
 *
 * 5/13/25 - Modified by Adrian Aquino, added search function
 * 5/14/25 - Modified by Adrian Aquino, added recipe deletion,
 * added image upload functionality, separated external API and MongoDB methods
 *
 */

const Recipe = require('../models/Recipe');
const RecipeImage = require('../models/RecipeImage');
const upload = require('../middlewares/upload');

/**
 *
 * getExternalRecipe
 *
 * Fetches recipe data from TheMealDB API and renders external recipe page
 *
 * @param    req    HTTP request object
 * @param    res    HTTP response object
 * @param    next   Next middleware function
 *
 */
exports.getExternalRecipe = async (req, res, next) => {
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

    res.render('recipe-external', {
      recipe: data.meals[0],
      price: price,
      title: data.meals[0].strMeal,
      isAuthenticated: !!req.session.user
    });
  } catch (error) {
    console.error('Error fetching external recipe:', error);
    res.status(500).render('error', {
      message: 'Error loading recipe',
      error: { status: 500 },
      title: 'Error'
    });
  }
};

/**
 *
 * getUserRecipe
 *
 * Fetches recipe data from MongoDB and renders user recipe page
 *
 * @param    req    HTTP request object
 * @param    res    HTTP response object
 * @param    next   Next middleware function
 *
 */
exports.getUserRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).render('error', {
        message: 'Recipe not found',
        error: { status: 404 },
        title: 'Recipe Not Found'
      });
    }

    res.render('recipe', {
      recipe: recipe,
      price: recipe.estimatedCost.toFixed(2),
      title: recipe.title,
      isAuthenticated: !!req.session.user
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).render('error', {
      message: 'Error loading recipe',
      error: { status: 500 },
      title: 'Error'
    });
  }
};

/**
 *
 * getRecipeImage
 *
 * Retrieves an image for a recipe
 *
 * @param    req    HTTP request object
 * @param    res    HTTP response object
 * @param    next   Next middleware function
 *
 */
exports.getRecipeImage = async (req, res, next) => {
  try {
    const recipeId = req.params.id;

    // Find image in database
    const image = await RecipeImage.findOne({ recipeId });

    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }

    // Set the content type header and send the image data
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * createRecipe
 *
 * Creates a new recipe with possible image
 *
 * @param    req    HTTP request object
 * @param    res    HTTP response object
 * @param    next   Next middleware function
 *
 */
exports.createRecipe = async (req, res, next) => {
  try {
    upload.single('recipeImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).render('user/recipe-form', {
          title: 'Create Recipe',
          errors: [{ msg: err.message || 'File upload error' }],
          recipe: null
        });
      }

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

        // Set hasImage based on whether an image was uploaded
        const hasImage = !!req.file;

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
          createdBy: req.session.user.id,
          hasImage
        });

        const savedRecipe = await newRecipe.save();

        // If image was uploaded, save it
        if (req.file) {
          const newImage = new RecipeImage({
            recipeId: savedRecipe._id,
            data: req.file.buffer,
            contentType: req.file.mimetype
          });
          await newImage.save();
        }

        res.redirect('/user/profile');
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * updateRecipe
 *
 * Updates a recipe with possible new image
 *
 * @param    req    HTTP request object
 * @param    res    HTTP response object
 * @param    next   Next middleware function
 *
 */
exports.updateRecipe = async (req, res, next) => {
  try {
    upload.single('recipeImage')(req, res, async (err) => {
      if (err) {
        const recipe = await Recipe.findById(req.params.id);
        return res.status(400).render('user/recipe-form', {
          title: 'Edit Recipe',
          errors: [{ msg: err.message || 'File upload error' }],
          recipe
        });
      }

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

        const updateData = {
          title,
          description,
          ingredients: parsedIngredients,
          instructions: parsedInstructions,
          prepTime,
          cookTime,
          estimatedCost,
          category,
          dietaryRestrictions
        };

        // If a new image was uploaded, update the hasImage flag
        if (req.file) {
          updateData.hasImage = true;
        }

        const recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true });

        // If image was uploaded, save it
        if (req.file) {
          // Check if recipe already has an image
          const existingImage = await RecipeImage.findOne({ recipeId: req.params.id });

          if (existingImage) {
            // Update existing image
            existingImage.data = req.file.buffer;
            existingImage.contentType = req.file.mimetype;
            await existingImage.save();
          } else {
            // Create new image document
            const newImage = new RecipeImage({
              recipeId: req.params.id,
              data: req.file.buffer,
              contentType: req.file.mimetype
            });
            await newImage.save();
          }
        }

        res.redirect('/user/profile');
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * searchRecipes
 *
 * Searches recipes based on a query string
 *
 * @param    req    HTTP request object
 * @param    res    HTTP response object
 * @param    next   Next middleware function
 *
 */
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

/**
 *
 * deleteRecipe
 *
 * Deletes a recipe and its associated image
 *
 * @param    req    HTTP request object
 * @param    res    HTTP response object
 * @param    next   Next middleware function
 *
 */
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    console.log('DELETE method received for ID:', req.params.id);
    // Check if recipe exists and belongs to the current user
    // if (!recipe || recipe.createdBy.toString() !== req.session.user.id) {
    //   return res.status(403).send('Access denied: You cannot delete recipes you did not create');
    // }

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