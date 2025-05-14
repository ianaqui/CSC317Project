const express = require('express');
const router = express.Router();
const db = require('../conf/database'); // assuming you're using a MySQL setup

// Delete a recipe by ID
router.post('/delete/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        const [result] = await db.execute('DELETE FROM recipes WHERE id = ?', [recipeId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Recipe deleted successfully' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error("Error deleting recipe:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
