# My Shop - E-commerce Application

## 🚀 Hướng Dẫn Triển Khai Chi Tiết

### Bước 1: Thiết Lập Database MongoDB Atlas

#### 1.1 Tạo Tài Khoản MongoDB Atlas
1. Truy cập [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" (Dùng Miễn Phí)
3. Điền thông tin:
   - Email: Nhập email của bạn
   - First Name: Tên
   - Last Name: Họ
   - Password: Mật khẩu mạnh
4. Click "Create Account"
5. Xác nhận email bằng cách click link trong email

#### 1.2 Tạo Cluster Database
1. Sau khi đăng nhập, click "Build a Database"
2. Chọn "M0 Cluster" (Free tier)
3. Chọn "AWS" làm Cloud Provider
4. Chọn region gần nhất (ví dụ: ap-southeast-1 cho Singapore)
5. Đặt tên cluster: "my-shop-cluster"
6. Click "Create Cluster"
7. Chờ khoảng 5-10 phút để cluster được tạo

#### 1.3 Tạo Database User
1. Trong cluster, click "Database Access" (trái sidebar)
2. Click "Add New Database User"
3. Chọn "Password" authentication
4. Username: `myshopuser`
5. Password: Đặt mật khẩu mạnh (ghi nhớ để dùng sau)
6. Chọn "Read and write to any database"
7. Click "Add User"

#### 1.4 Cấu Hình Network Access
1. Click "Network Access" (trái sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

#### 1.5 Lấy Connection String
1. Click "Clusters" (trái sidebar)
2. Click "Connect" trên cluster của bạn
3. Chọn "Connect your application"
4. Copy connection string, sẽ có dạng:
   ```
   mongodb+srv://myshopuser:<password>@my-shop-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Thay `<password>` bằng mật khẩu bạn đã tạo

#### 1.6 Cập Nhật File .env
1. Mở file `backend/.env`
2. Thay dòng `DB_CONNECTION_STRING` bằng connection string của bạn:
   ```
   DB_CONNECTION_STRING=mongodb+srv://myshopuser:YOUR_PASSWORD@my-shop-cluster.xxxxx.mongodb.net/my_shop?retryWrites=true&w=majority
   ```

### Bước 2: Triển Khai Backend trên Railway

#### 2.1 Tạo Tài Khoản Railway
1. Truy cập [https://railway.app](https://railway.app)
2. Click "Login" và đăng nhập bằng GitHub
3. Cho phép Railway truy cập repository của bạn

#### 2.2 Tạo Project Mới
1. Click "New Project"
2. Chọn "Deploy from GitHub repo"
3. Tìm repository "my_shop" của bạn
4. Click "Connect" trên repository

#### 2.3 Cấu Hình Project
1. Railway sẽ tự động detect đây là PHP project
2. Chọn branch "main"
3. Click "Deploy"

#### 2.4 Thêm Environment Variables
1. Trong project dashboard, click tab "Variables"
2. Thêm các biến từ file `backend/.env`:
   ```
   APP_NAME=My Shop API
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION_STRING=mongodb+srv://myshopuser:YOUR_PASSWORD@my-shop-cluster.xxxxx.mongodb.net/my_shop?retryWrites=true&w=majority
   DB_DATABASE=my_shop
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
   JWT_EXPIRE_HOURS=24
   SERVER_HOST=0.0.0.0
   SERVER_PORT=8080
   CORS_ORIGIN=*
   LOG_LEVEL=info
   ```
3. Click "Add" cho mỗi biến

#### 2.5 Deploy và Lấy URL
1. Click "Deploy" để bắt đầu triển khai
2. Chờ quá trình build hoàn thành (khoảng 5-10 phút)
3. Trong tab "Settings", copy "Public URL" (ví dụ: `https://my-shop-production.up.railway.app`)

### Bước 3: Cập Nhật Frontend

#### 3.1 Cập Nhật vercel.json
1. Mở file `vercel.json`
2. Thay `REACT_APP_API_URL` bằng URL backend từ Railway:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "env": {
       "REACT_APP_API_URL": "https://my-shop-production.up.railway.app/api/v1"
     }
   }
   ```

#### 3.2 Push Changes lên GitHub
1. Mở terminal/command prompt
2. Chạy các lệnh:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

#### 3.3 Vercel Tự Động Redeploy
1. Vào [vercel.com](https://vercel.com)
2. Vào dashboard project của bạn
3. Vercel sẽ tự động detect changes và redeploy
4. Chờ quá trình deploy hoàn thành

### Bước 4: Test Ứng Dụng

#### 4.1 Test API Endpoints
1. Mở browser hoặc Postman
2. Test các API endpoints:

**Đăng ký user:**
```
POST https://my-shop-production.up.railway.app/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Đăng nhập:**
```
POST https://my-shop-production.up.railway.app/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Lấy danh sách sản phẩm:**
```
GET https://my-shop-production.up.railway.app/api/v1/products
```

#### 4.2 Test Frontend
1. Truy cập URL Vercel của bạn
2. Thử đăng ký tài khoản
3. Thử đăng nhập
4. Kiểm tra xem có thể xem sản phẩm không

### Bước 5: Troubleshooting

#### Lỗi Kết Nối Database
- Kiểm tra connection string trong Railway variables
- Đảm bảo MongoDB Atlas cho phép access từ anywhere (0.0.0.0/0)
- Kiểm tra username/password trong connection string

#### Lỗi API Không Hoạt Động
- Kiểm tra Railway logs trong tab "Logs"
- Đảm bảo tất cả environment variables được set đúng
- Kiểm tra CORS settings

#### Lỗi Frontend
- Kiểm tra browser console (F12)
- Đảm bảo REACT_APP_API_URL được set đúng trong Vercel
- Kiểm tra network tab để xem API calls

### 🎉 Hoàn Thành!
Sau khi hoàn thành các bước trên, ứng dụng của bạn sẽ có:
- Frontend chạy trên Vercel
- Backend chạy trên Railway
- Database trên MongoDB Atlas
- API endpoints hoạt động đầy đủ

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
