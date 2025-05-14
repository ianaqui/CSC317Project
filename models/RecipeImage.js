/**
 *
 * @author - Adrian Aquino
 * @file RecipeImage.js - MongoDB model definition for recipe images
 *
 * 5/14/25 - Initial implementation
 *
 */
const mongoose = require('mongoose');

/**
 * RecipeImage Schema
 *
 * Defines the structure for storing recipe images
 */
const RecipeImageSchema = new mongoose.Schema({
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
        index: true
    },
    data: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RecipeImage', RecipeImageSchema);