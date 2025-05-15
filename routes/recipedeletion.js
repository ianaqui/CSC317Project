const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe'); // adjust path as needed

// DELETE route to delete a recipe by ID
router.delete('/recipes/:id', async (req, res) => {
  try {recipedeletionrecipedeletion
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
