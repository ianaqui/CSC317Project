# Recipe Sharing Platform

A web application that allows users to create, share, and discover recipes with detailed time and cost information.

Visit our live site: [https://csc317-group-k.onrender.com](https://csc317-group-k.onrender.com)

## Features

* Full user authentication system (registration, login, profile management)
* Create, edit, view, and delete recipes (CRUD operations)
* Detailed recipe information including:
   * Preparation and cooking time
   * Estimated cost
   * Ingredients list with quantities
   * Step-by-step instructions
* Advanced recipe filtering:
   * Filter by meal type (breakfast, lunch, dinner, etc.)
   * Filter by cost range
   * Filter by preparation time
   * Filter by dietary restrictions (vegetarian, vegan, etc.)
* Search functionality for finding recipes
* Dietary restriction tags (dairy-free, gluten-free, nut-free)
* Responsive UI optimized for all devices
* Form validation (both client and server side)

## Recipe Features

### Creating Recipes
Users can create recipes with:
* Title and description
* Detailed ingredients list with quantities
* Step-by-step instructions
* Preparation and cooking time
* Estimated cost
* Category and meal type
* Dietary restriction flags

### Searching & Filtering
The platform offers several ways to find recipes:
* Search by keyword
* Filter by cost (budget-friendly to premium)
* Filter by time (quick meals to elaborate preparations)
* Filter by dietary restrictions
* Filter by meal type (vegetarian, vegan, meat-based)

### Recipe Management
Authenticated users can:
* Create new recipes
* Edit their own recipes
* Delete their own recipes
* View all recipes in the system

## Complex Feature: Recipe Filtering System
Our application includes a sophisticated filtering system that allows users to combine multiple criteria (cost, time, dietary restrictions, and meal type) to find exactly the recipes they need. This feature includes real-time updates of search results as filters are applied, creating a seamless user experience.

## Team Responsibilities

### Adrian Aquino: Backend - Database Implementation
* **Backend Features:**
  * Configure MongoDB database connection
  * Create Recipe model with all required fields and validation
  * Implement data persistence for recipes and user data
  * Develop database queries for cost and time filtering
  * Design database schema for recipe-user relationships

### Lakshyaraj Bhati: Backend - API and Authentication
* **Backend Features:**
  * Create RESTful API endpoints for all recipe operations
  * Develop recipe controller with complete CRUD functions
  * Implement server-side validation for all user inputs
  * Set up authentication and authorization for secure routes
  * Create error handling middleware for API responses

### Emma Wright: Frontend - Design and Layout
* **Frontend Features:**
  * Design responsive HTML/CSS layout for all application pages
  * Create consistent design system with typography and colors
  * Build recipe cards and detailed view templates
  * Implement mobile-friendly navigation and interface
  * Design dietary restriction tag visual system

### Andres Pineda: Frontend - Interactivity and Integration
* **Frontend Features:**
  * Implement client-side form validation for all inputs
  * Create interactive filter and search components
  * Build dynamic ingredient form with add/remove functionality
  * Develop responsive menu and user interface behaviors
  * Connect frontend forms with backend API endpoints

## API Integration

This application combines two sources of recipe data:

### TheMealDB API (External)
- Random recipes displayed on the homepage
- Recipes displayed with /recipe/external/:id route
- Used primarily for inspiration and featured recipes
- Read-only access, cannot be edited or deleted

### MongoDB (User-created)
- Stores recipes created by registered users
- Recipes displayed with /recipe/:id route
- Full CRUD functionality (Create, Read, Update, Delete)
- Includes features like image upload and dietary restrictions

Both types of recipes are presented with consistent UI styling. External recipes are read-only, while user-created recipes can be edited or deleted by their creators.

## Acknowledgments

* Built with:
  * Express.js - Web application framework
  * MongoDB with Mongoose - Database system
  * JavaScript, HTML5, and CSS3 - Frontend development
  * EJS - Templating engine
  * bcrypt - Password encryption
  * express-session - Session management
  * multer - File upload handling
  * method-override - RESTful methods
  * TheMealDB API - External recipe data source
* Inspired by recipe site made by SparkPeople