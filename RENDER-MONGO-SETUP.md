# CSC317 Project Setup Instructions

This guide will walk you through setting up the CSC317 project environment, including:
- Forking the repository
- Setting up MongoDB locally and remotely 
- Creating a .env file for environment variables
- Setting up a project on Render.com connected to your GitHub repository

## 1. Fork the Repository

First, you'll need to fork the starter app repository:

1. **Navigate to the original repository**:
   - Go to [https://github.com/goleador/CSC317Project](https://github.com/goleador/CSC317Project)
   
2. **Fork the repository**:
   - Click the "Fork" button in the top-right corner of the page
   - This creates your own copy of the repository under your GitHub account

3. **Clone your forked repository to your local machine**:
   ```bash
   # Navigate to your desired directory
   git clone https://github.com/YOUR-USERNAME/CSC317Project.git
   cd CSC317Project

   # Install dependencies
   npm install
   ```
   (Replace YOUR-USERNAME with your actual GitHub username)

## 2. Set Up MongoDB

### Local MongoDB Setup

1. **Install MongoDB Community Edition**:
   - For macOS (using Homebrew):
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community
     ```
   - For Windows:
     - Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - For Linux (Ubuntu):
     ```bash
     sudo apt update
     sudo apt install mongodb
     ```

2. **Start MongoDB Service**:
   - macOS: `brew services start mongodb-community`
   - Windows: MongoDB should be installed as a service and running
   - Linux: `sudo systemctl start mongodb`

3. **Verify MongoDB is running**:
   ```bash
   mongo --eval "db.version()"
   ```
   
### Remote MongoDB Setup (MongoDB Atlas)

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**:
   - Click "Build a Cluster" and select the free tier option
   - Choose your preferred cloud provider and region
   - Click "Create Cluster" (this may take a few minutes)

3. **Set Up Database Access**:
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Create a username and password (save these securely!)
   - Set privileges to "Read and Write to Any Database"
   - Click "Add User"

4. **Configure Network Access**:
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - For development, select "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, you can add specific IP addresses later
   - Click "Confirm"

5. **Get Your Connection String**:
   - Once your cluster is created, click "Connect"
   - Select "Connect your application"
   - Copy the connection string (it will look like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>`)
   - Replace `<username>` and `<password>` with your database user credentials
   - Replace `<dbname>` with your desired database name (e.g., "csc317db")

## 3. Create a .env File

Create a `.env` file in the root of your project with the following variables:

```
# Local Development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/csc317db

# For production with MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/csc317db

# Add any other environment variables needed for your app
JWT_SECRET=your_jwt_secret_key
```

Make sure to:
- Replace the Atlas connection string with your actual connection string
- Generate a strong random string for JWT_SECRET
- Never commit this file to Git (check that it's in your .gitignore)

## 4. Set Up Render.com

1. **Create a Render Account**:
   - Go to [Render.com](https://render.com/) and sign up for an account
   - Verify your email address

2. **Connect Your GitHub Account**:
   - In the Render dashboard, click on your profile icon
   - Select "Account Settings"
   - Go to "Git Providers"
   - Click "Connect" next to GitHub
   - Authorize Render to access your GitHub repositories

3. **Create a New Web Service**:
   - Click "New +" at the top of the dashboard
   - Select "Web Service"
   - Find and select your repository (CSC317Project)
   - Configure your service:
     - Name: `CSC317-Group-X` (replace X with your group letter)
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Select the free plan for development

4. **Set Environment Variables**:
   - In the service configuration page, find "Environment" section
   - Add the following environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `PORT`: `10000` (Render will override this, but it's good to have)
     - `JWT_SECRET`: The same secret key you used locally
   - Click "Save Changes"

5. **Deploy the Service**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - You can monitor the deployment process in the "Events" tab

6. **Verify Deployment**:
   - Once deployment is complete, you can access your application at the URL provided by Render (typically `https://your-service-name.onrender.com`)

## Additional Notes

- Your application will automatically redeploy when you push changes to your repository
- For debugging deployment issues, check the "Logs" tab in your Render dashboard
- Remember to keep your MongoDB Atlas and Render.com credentials secure
- For local development, run your app with `npm start`

## Troubleshooting

- If your local MongoDB connection fails, ensure the MongoDB service is running
- If your Render deployment fails, check the build logs for errors
- For MongoDB Atlas connection issues, verify your network access settings and connection string
