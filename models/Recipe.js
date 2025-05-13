/**
 *
 * @author - Adrian Aquino
 * @file Recipe.js - MongoDB model definition for recipes
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
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: String,
            required: false, //changed to false (emma)
            trim: true
        }
    }],
    instructions: [String],
    prepTime: {
        type: Number,
        required: true,
        min: [1, 'Preparation time must be at least 1 minute']
    },
    cookTime: {
        type: Number,
        required: true,
        min: [0, 'Cook time cannot be negative']
    },
    estimatedCost: {
        type: Number,
        required: true,
        min: [0, 'Cost cannot be negative']
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
RecipeSchema.index({ estimatedCost: 1 });
RecipeSchema.index({ prepTime: 1 });

/**
 *
 * findByUser
 *
 * Static method to find recipes by user ID
 *
 * @param    userId   The user's ID to search for
 *
 * @return   Promise with array of recipes
 */
RecipeSchema.statics.findByUser = function(userId) {
    return this.find({ createdBy: userId }).sort({ createdAt: -1 });
};

/**
 *
 * findByCostRange
 *
 * Static method to find recipes by cost range
 *
 * @param    min     Minimum cost (inclusive)
 * @param    max     Maximum cost (inclusive)
 *
 * @return   Promise with array of recipes
 */
RecipeSchema.statics.findByCostRange = function(min, max) {
    const query = {};

    if (min !== undefined) {
        query.estimatedCost = query.estimatedCost || {};
        query.estimatedCost.$gte = min;
    }

    if (max !== undefined) {
        query.estimatedCost = query.estimatedCost || {};
        query.estimatedCost.$lte = max;
    }

    return this.find(query).sort({ estimatedCost: 1 });
};

/**
 *
 * findByPrepTime
 *
 * Static method to find recipes by preparation time
 *
 * @param    maxTime     Maximum preparation time
 *
 * @return   Promise with array of recipes
 */
RecipeSchema.statics.findByPrepTime = function(maxTime) {
    return this.find({ prepTime: { $lte: maxTime } }).sort({ prepTime: 1 });
};

/**
 *
 * findByTotalTime
 *
 * Static method to find recipes by total time
 *
 * @param    maxTotalTime    Maximum total time (prep + cook)
 *
 * @return   Promise with array of recipes
 */
RecipeSchema.statics.findByTotalTime = function(maxTotalTime) {
    return this.find({
        $expr: { $lte: [{ $add: ['$prepTime', '$cookTime'] }, maxTotalTime] }
    }).sort({ prepTime: 1, cookTime: 1 });
};

module.exports = mongoose.model('Recipe', RecipeSchema);