# Recipe Sharing Platform

A web application that allows users to create, share, and discover recipes with detailed time and cost information. Built with Express.js, MongoDB, and JavaScript. 

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
* Save favorite recipes

## Complex Feature: Multi-criteria Recipe Filtering System
Our application includes a sophisticated filtering system that allows users to combine multiple criteria (cost, time, dietary restrictions, and meal type) to find exactly the recipes they need. This feature includes real-time updates of search results as filters are applied, creating a seamless user experience.

## Team Responsibilities

### Adrian Aquino: Backend - Database and Model Implementation
* **Backend Features:**
  * Set up MongoDB database connection (local and cloud)
  * Create Recipe model with proper validation rules
  * Implement database query methods for recipe filtering
  * Configure data persistence and relationships between models
  * Set up error handling for database operations

### Student 2: Backend - API Development
* **Backend Features:**
  * Develop RESTful API endpoints for recipes
  * Create recipe controller with CRUD functionality
  * Implement server-side validation for inputs
  * Set up authentication for protected routes
  * Build cost and time filtering logic
  * Develop meal category classification system

### Student 3: Frontend - UI Design and Implementation
* **Frontend Features:**
  * Create responsive HTML/CSS layout for all pages
  * Design recipe cards and detail views
  * Implement consistent typography and design system
  * Build mobile-friendly navigation
  * Style dietary restriction indicators
  * Create visual hierarchy for recipe information

### Student 4: Frontend and Full-Stack Integration
* **Frontend Features:**
  * Implement client-side form validation
  * Create interactive UI elements with JavaScript
  * Build dynamic ingredient management interface
* **Full-Stack Features:**
  * Connect frontend and backend for CRUD operations
  * Implement dual-layer validation (client and server)
  * Create multi-criteria filtering interface
  * Develop search functionality across the application

## Acknowledgments

* Built with Express.js, MongoDB, and JavaScript
* Inspired by recipe site made by SparkPeople