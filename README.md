# Recipe Sharing Platform

A web application that allows users to create, share, and discover recipes with detailed time and cost information. Built with Express.js, MongoDB, and JavaScript.

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
* Save favorite recipes

## Team Responsibilities

### Adrian Aquino: Database and Recipe Model Implementation
* Set up GitHub repository and project structure
* Configure MongoDB connection (local and Atlas)
* Set up Render.com deployment environment
* Create Recipe model with all required fields
* Implement data validation rules
* Create sample recipe data for testing
* Develop database queries for recipe filtering

### Student 2: Recipe Routes and Controllers
* Develop recipe routes and endpoints
* Create recipeController with CRUD functions
* Implement search and filter functionality
* Connect recipe operations with authentication
* Create server-side validation for recipe inputs
* Develop error handling for recipe operations
* Test API endpoints and functionality

### Student 3: Recipe Views and CSS
* Create recipe listing and detail page templates
* Design recipe creation and editing forms
* Implement responsive layout for all pages
* Create consistent recipe card design
* Develop filter and search UI components
* Style dietary restriction indicators
* Ensure mobile-friendly design and usability

### Student 4: Client-side JavaScript and Interactions
* Implement client-side form validation
* Create dynamic ingredient form fields (add/remove)
* Develop interactive filter components
* Build client-side search functionality
* Create form submission handling
* Implement responsive menu behavior
* Develop client-side error handling and feedback

## Acknowledgments

* Built with Express.js, MongoDB, and JavaScript
* Inspired by recipe site made by SparkPeople