# My Shop - E-commerce Application

## 🚀 Deployment Guide

### Frontend (React) - Deployed on Vercel
The frontend is already configured for Vercel deployment.

### Backend (PHP + MongoDB) - Deployment Steps

#### 1. Set up MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" section
5. Update `backend/.env` with your MongoDB Atlas connection string:
   ```
   DB_CONNECTION_STRING=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/my_shop?retryWrites=true&w=majority
   ```

#### 2. Deploy Backend
Since Vercel doesn't support PHP serverless functions, deploy the backend separately:

**Option A: Railway (Recommended - Free tier available)**
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables from `backend/.env`
4. Deploy automatically

**Option B: Heroku**
1. Go to [Heroku.com](https://heroku.com)
2. Create a new app
3. Connect your GitHub repository
4. Add environment variables
5. Deploy

**Option C: DigitalOcean App Platform**
1. Go to [DigitalOcean](https://digitalocean.com)
2. Create a new app
3. Connect your repository
4. Configure environment variables
5. Deploy

#### 3. Update Frontend Configuration
After deploying the backend, update the API URL in `vercel.json`:
```json
{
  "env": {
    "REACT_APP_API_URL": "https://your-backend-url.com/api/v1"
  }
}
```

#### 4. Redeploy Frontend
Push the updated configuration to GitHub and Vercel will automatically redeploy.

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/products` - Create product (Admin/Staff only)
- `PUT /api/v1/products/{id}` - Update product (Admin/Staff only)
- `DELETE /api/v1/products/{id}` - Delete product (Admin only)

## 🔧 Environment Variables

### Backend (.env)
```
APP_NAME="My Shop API"
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/my_shop
DB_DATABASE=my_shop
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE_HOURS=24
SERVER_HOST=0.0.0.0
SERVER_PORT=8080
CORS_ORIGIN=*
LOG_LEVEL=info
```

### Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend-url.com/api/v1
```

## 🛠 Local Development

1. **Frontend:**
   ```bash
   npm install
   npm start
   ```

2. **Backend:**
   ```bash
   cd backend
   composer install
   php -S localhost:8080 -t public
   ```

3. **Database:**
   - Use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
   - Or install MongoDB locally

## 📦 Technologies Used

- **Frontend:** React, React Router, Axios
- **Backend:** PHP, Slim Framework, MongoDB
- **Authentication:** JWT
- **Validation:** Respect Validation
- **Deployment:** Vercel (Frontend), Railway/Heroku (Backend)
