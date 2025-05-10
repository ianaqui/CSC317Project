/**
 *
 * @author - Adrian Aquino
 * @file Recipe.js - MongoDB model definition for recipes in the system
 *
 * 04/23/25 - Initial implementation
 * 04/26/25 - Added dietary restrictions and cost fields
 * 04/28/25 - Added indexing for better query performance
 *
 */

const mongoose = require('mongoose');

/**
 * Recipe Schema
 *
 * Defines the structure and validation for recipe documents
 */
const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    ingredients: [{
        name: String,
        quantity: String
    }],
    instructions: [String],
    prepTime: {
        type: Number,
        required: true
    },
    cookTime: {
        type: Number,
        required: true
    },
    estimatedCost: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack']
    },
    dietaryRestrictions: {
        vegetarian: { type: Boolean, default: false },
        vegan: { type: Boolean, default: false },
        glutenFree: { type: Boolean, default: false },
        dairyFree: { type: Boolean, default: false },
        nutFree: { type: Boolean, default: false }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create indexes for common query patterns
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ 'dietaryRestrictions.vegetarian': 1 });
RecipeSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Recipe', RecipeSchema);