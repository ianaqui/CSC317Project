
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
