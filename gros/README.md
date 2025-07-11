# Grocery Management System - Backend (gros)

This is the Spring Boot backend application for the Grocery Management System, configured to run on port 9090.

## 🚀 Quick Start

### Prerequisites

- Java 21
- Maven 3.6+

### Running the Application

1. **Navigate to the project directory:**

   ```bash
   cd gros
   ```

2. **Clean and compile:**

   ```bash
   ./mvnw clean compile
   ```

3. **Run the application:**

   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access the application:**
   - API Base URL: `http://localhost:9090/api`
   - H2 Console: `http://localhost:9090/h2-console`

## 📁 Project Structure

```
gros/
├── src/main/java/com/example/gros/
│   ├── controller/          # REST API Controllers
│   │   ├── ProductController.java
│   │   ├── UserController.java
│   │   ├── CartController.java
│   │   └── OrderController.java
│   ├── service/            # Business Logic Services
│   │   ├── ProductService.java
│   │   ├── UserService.java
│   │   ├── AuthService.java
│   │   ├── CartService.java
│   │   ├── OrderService.java
│   │   └── CustomUserDetailsService.java
│   ├── repository/         # Data Access Layer
│   │   ├── ProductRepository.java
│   │   ├── UserRepository.java
│   │   ├── CartItemRepository.java
│   │   ├── OrderRepository.java
│   │   └── LoginTrackingRepository.java
│   ├── model/             # Entity Classes
│   │   ├── Product.java
│   │   ├── User.java
│   │   ├── CartItem.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   └── LoginTracking.java
│   ├── dto/               # Data Transfer Objects
│   │   ├── RegisterRequest.java
│   │   ├── LoginRequest.java
│   │   ├── UserUpdateRequest.java
│   │   ├── PasswordChangeRequest.java
│   │   ├── CartItemRequest.java
│   │   ├── OrderRequest.java
│   │   └── ApiResponse.java
│   ├── config/            # Configuration Classes
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java
│   ├── exception/         # Exception Handling
│   │   ├── GlobalExceptionHandler.java
│   │   ├── UserNotFoundException.java
│   │   └── ProductNotFoundException.java
│   └── GrosApplication.java
└── src/main/resources/
    ├── application.properties
    ├── schema.sql
    └── data.sql
```

## 🔧 Configuration

### Application Properties

- **Port**: 9090
- **Database**: H2 in-memory
- **CORS**: Enabled for `http://localhost:4200`
- **Security**: Spring Security with JWT-like authentication

### Database Schema

- **registration**: User accounts and authentication
- **product**: Product catalog
- **cart_item**: Shopping cart items
- **order_table**: Order management
- **order_item**: Order line items
- **login_tracking**: User session tracking

## 📡 API Endpoints

### Authentication & Users

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/me/{customerId}` - Get user profile
- `PUT /api/users/me/{customerId}` - Update user profile
- `PUT /api/users/{customerId}/password` - Change password

### Products

- `GET /api/products` - Get all products
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/{productId}` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/{productId}` - Update product
- `DELETE /api/products/{productId}` - Delete product

### Cart

- `GET /api/cart?customerId={id}` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/{productId}` - Remove item from cart

### Orders

- `POST /api/orders/place-order` - Place new order
- `GET /api/orders?customerId={id}` - Get user's orders

## 🔒 Security

- Spring Security with custom authentication
- Password encryption using BCrypt
- Role-based access control (ADMIN/CUSTOMER)
- CORS configuration for Angular frontend

## 🗄️ Database

### H2 Console Access

- URL: `http://localhost:9090/h2-console`
- JDBC URL: `jdbc:h2:mem:grocery_db`
- Username: `sa`
- Password: (empty)

### Sample Data

The application includes sample data for:

- Admin user: `admin@grocery.com`
- Customer users: `john@example.com`, `piyushpawar193@gmail.com`
- Sample products: Apples, Bananas, Milk

## 🛠️ Development

### Building

```bash
./mvnw clean package
```

### Testing

```bash
./mvnw test
```

### Running with Profile

```bash
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

## 🔗 Frontend Integration

This backend is designed to work with the Angular frontend running on `http://localhost:4200`. The CORS configuration allows cross-origin requests from the frontend.

## 📝 Notes

- All endpoints return JSON responses
- Error handling is centralized in `GlobalExceptionHandler`
- Database is in-memory H2, data resets on restart
- Search functionality supports case-insensitive product name matching
