## 🔐 Authentication

The Hyper Delivery Application uses **JWT (JSON Web Tokens)** for secure authentication and authorization. This section covers the complete authentication flow, middleware implementation, and security practices.

### 🔑 JWT Token System

**Token Structure:**
```
Header.Payload.Signature
```

**Token Payload:**
```json
{
  "userId": "user_id_here",
  "email": "user@example.com",
  "role": "user", // or "admin"
  "iat": 1625097600,
  "exp": 1625184000
}
```

**Token Expiration:** 7 days (configurable via environment variables)

---

### 🚀 Authentication Flow

#### 1. User Registration
```javascript
// POST /api/auth/register
const registerUser = async (userData) => {
  // 1. Validate input data
  // 2. Check if user already exists
  // 3. Hash password using bcrypt
  // 4. Save user to database
  // 5. Generate JWT token
  // 6. Return token + user data
}
```

#### 2. User Login
```javascript
// POST /api/auth/login
const loginUser = async (credentials) => {
  // 1. Find user by email
  // 2. Compare password with hashed version
  // 3. Generate JWT token
  // 4. Return token + user data
}
```

#### 3. Token Verification
```javascript
// Middleware: verifyToken
const verifyToken = (req, res, next) => {
  // 1. Extract token from Authorization header
  // 2. Verify token using JWT_SECRET
  // 3. Decode user information
  // 4. Attach user to request object
  // 5. Continue to next middleware
}
```

---

### 🛡️ Middleware Implementation

#### Authentication Middleware
```javascript
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
```

#### Admin Authorization Middleware
```javascript
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};
```

---

### 🔒 Password Security

#### Password Hashing
```javascript
const bcrypt = require('bcryptjs');

// Hash password before saving
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password during login
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

#### Password Requirements
- Minimum 6 characters
- Contains at least one letter and one number (recommended)
- Stored as bcrypt hash with salt rounds: 12

---

### 🔧 Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Database
MONGODB_URI=mongodb://localhost:27017/blinkit

# Server
NODE_ENV=development
PORT=5000
```

---

### 📱 Frontend Integration

#### Storing Tokens
```javascript
// Store token in localStorage
localStorage.setItem('authToken', token);

// Retrieve token
const token = localStorage.getItem('authToken');

// Remove token (logout)
localStorage.removeItem('authToken');
```

#### API Request Headers
```javascript
// Axios interceptor for automatic token attachment
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Or manually for each request
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};
```

#### Redux Integration
```javascript
// Auth slice for state management
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});
```

---

### 🚦 Route Protection

#### Protected Routes (Backend)
```javascript
// User routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);

// Admin routes
router.get('/users', authenticateUser, authorizeAdmin, getAllUsers);
router.delete('/users/:id', authenticateUser, authorizeAdmin, deleteUser);

// Cart routes
router.get('/cart', authenticateUser, getCart);
router.post('/cart/add', authenticateUser, addToCart);
```

#### Protected Routes (Frontend)
```javascript
// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Usage in App.js
<Route path="/profile" element={
  <PrivateRoute>
    <Profile />
  </PrivateRoute>
} />
```

---

### ⚠️ Security Best Practices

#### Token Security
- Store JWT secret in environment variables
- Use strong, random JWT secrets (minimum 32 characters)
- Implement token refresh mechanism for longer sessions
- Clear tokens on logout

#### API Security
- Rate limiting on auth endpoints
- Input validation and sanitization
- CORS configuration for allowed origins
- HTTPS in production

#### Error Handling
```javascript
// Don't expose sensitive information in error messages
const handleAuthError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return 'Invalid token';
  }
  if (error.name === 'TokenExpiredError') {
    return 'Token expired';
  }
  return 'Authentication failed';
};
```

---

### 🧪 Testing Authentication

#### Test Scenarios
- ✅ User registration with valid data
- ✅ User registration with duplicate email
- ✅ User login with correct credentials
- ✅ User login with incorrect credentials
- ✅ Access protected routes with valid token
- ✅ Access protected routes without token
- ✅ Access admin routes with user token
- ✅ Token expiration handling

#### Sample Test Cases
```javascript
// Registration test
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
      
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(userData.email);
  });
});
```

---

### 🔄 Token Refresh (Optional Enhancement)

```javascript
// Refresh token implementation
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};
```

This authentication system provides secure, scalable user management with proper token handling and role-based access control.