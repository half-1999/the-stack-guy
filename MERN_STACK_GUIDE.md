# MERN Stack Development - Complete Performance & Security Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                   (React + Vite)                             │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ React   │  │ Redux/    │  │ React    │  │ Axios/Fetch │  │
│  │ Router  │  │ Zustand   │  │ Query    │  │ Interceptor │  │
│  └─────────┘  └──────────┘  └──────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│                  (Node + Express)                            │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Routes  │  │ Middle-  │  │ Auth     │  │ Controllers │  │
│  │         │  │ ware     │  │ JWT      │  │             │  │
│  └─────────┘  └──────────┘  └──────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│                    (MongoDB + Redis)                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Mongoose│  │ Indexes  │  │ Redis    │  │ Aggregation │  │
│  │ Models  │  │          │  │ Cache    │  │ Pipeline    │  │
│  └─────────┘  └──────────┘  └──────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## FRONTEND (React) - Performance

### 1. Build & Bundle Optimization

#### Vite Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  plugins: [react()],
  build: {
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-lib': ['framer-motion', 'lucide-react'],
          'utils': ['axios', 'lodash'],
        },
      },
    },
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 500,
    // Generate source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Server configuration
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**Checklist:**
- [ ] Code splitting by routes
- [ ] Dynamic imports for heavy components
- [ ] Tree-shaking enabled
- [ ] Unused code eliminated
- [ ] Build minification active

### 2. Component Optimization

#### Lazy Loading Components
```javascript
// Good: Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

#### Memoization Strategy
```javascript
import { memo, useMemo, useCallback } from 'react';

// Heavy component - memoize to prevent re-renders
const ExpensiveList = memo(({ items, onItemClick }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

// Expensive calculation - useMemo
const processedData = useMemo(() => {
  return largeDataset.map(item => transformItem(item));
}, [largeDataset]);

// Callback function - useCallback
const handleClick = useCallback((id) => {
  navigate(`/item/${id}`);
}, [navigate]);
```

**Checklist:**
- [ ] React.memo on list items
- [ ] useMemo for expensive computations
- [ ] useCallback for passed callbacks
- [ ] Proper key props on lists

### 3. State Management

#### Server State (React Query)
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch with caching
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
});

// Mutation with invalidation
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  },
});
```

#### Client State (Zustand - lighter than Redux)
```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Usage in component
const { user, setUser } = useStore();
```

**Checklist:**
- [ ] React Query for server state
- [ ] Minimal client state
- [ ] Proper cache invalidation
- [ ] Optimistic updates where needed

### 4. Image & Asset Optimization

```javascript
// Lazy load images
<img 
  src={lazyImage} 
  loading="lazy" 
  srcSet={`${img400} 400w, ${img800} 800w, ${img1200} 1200w`}
  sizes="(max-width: 600px) 400px, 800px"
  alt="description"
/>

// Use WebP with fallback
<picture>
  <source srcSet={imageWebP} type="image/webp" />
  <img src={imageJpg} alt="description" />
</picture>
```

**Checklist:**
- [ ] WebP format with Jpeg fallback
- [ ] Lazy loading for below-fold images
- [ ] Responsive images (srcset)
- [ ] Image compression (use sharp)
- [ ] SVG for icons (not font icons)

### 5. Rendering Optimization

```javascript
// Virtual list for large datasets
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);

<FixedSizeList
  height={500}
  itemCount={10000}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>
```

**Checklist:**
- [ ] Virtual scrolling for 100+ items
- [ ] Pagination for large lists
- [ ] Debounce search inputs
- [ ] Throttle scroll events

---

## FRONTEND - Security

### 1. XSS Prevention

```javascript
// Always use React's built-in escaping
// Dangerous - AVOID:
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// Safe - Use DOMPurify if HTML needed:
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(dirtyHTML);

// URL encoding for URLs
const safeUrl = encodeURIComponent(userUrl);
```

**Checklist:**
- [ ] No dangerouslySetInnerHTML
- [ ] Sanitize any user input rendered as HTML
- [ ] Encode URLs properly
- [ ] Validate URLs before rendering

### 2. Authentication Security

```javascript
// Store tokens securely
// Option 1: HTTP-only cookies (RECOMMENDED for sensitive apps)
document.cookie = `token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/`;

// Option 2: In-memory for access token (NOT localStorage)
const [accessToken, setAccessToken] = useState(null);

// Axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
```

**Checklist:**
- [ ] HTTP-only cookies for tokens
- [ ] Access token in memory only
- [ ] Proper token refresh logic
- [ ] Clear tokens on logout

### 3. API Security

```javascript
// Axios instance with security
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken.content;
  }
  return config;
});

// Validate response structure
api.interceptors.response.use(
  (response) => {
    // Verify response schema
    if (!response.data || !response.data.success) {
      throw new Error('Invalid response');
    }
    return response;
  },
  (error) => {
    // Don't expose internals to client
    console.error('Request failed');
    return Promise.reject(new Error('Something went wrong'));
  }
);
```

**Checklist:**
- [ ] CSRF protection
- [ ] No sensitive data in URLs
- [ ] Validate API responses
- [ ] Error messages don't leak info

---

## BACKEND (Node.js) - Performance

### 1. Express.js Optimization

```javascript
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

// Security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// JSON parsing with limit
app.use(express.json({ limit: '10mb' }));

// URL-encoded parsing
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
app.use(express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true,
}));

// Remove X-Powered-By
app.disable('x-powered-by');

// Rate limiting (explained later)
```

**Checklist:**
- [ ] Helmet for security headers
- [ ] Gzip compression enabled
- [ ] Proper JSON limits set
- [ ] Static file caching
- [ ] X-Powered-By disabled

### 2. Database (MongoDB) Performance

#### Connection Pooling
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10, // Max concurrent connections
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

#### Indexes
```javascript
// User model indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 'text', email: 'text' }); // Text search
userSchema.index({ status: 1, createdAt: -1 }); // Compound index
```

#### Query Optimization
```javascript
// Use projection to limit fields
const user = await User.findById(id).select('name email role');

// Use lean() for read-only queries (much faster)
const users = await User.find({ status: 'active' }).lean();

// Use pagination
const page = 1;
const limit = 20;
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit);

// Use aggregation for complex queries
const result = await User.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$role', count: { $sum: 1 } } },
]);
```

**Checklist:**
- [ ] Connection pooling configured
- [ ] Indexes on query fields
- [ ] lean() for read-only queries
- [ ] Pagination for large datasets
- [ ] Aggregation for complex queries

### 3. Caching (Redis)

```javascript
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

await client.connect();

// Cache middleware
const cacheMiddleware = (key, ttl = 3600) => async (req, res, next) => {
  const cacheKey = `${key}:${req.originalUrl}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    client.setEx(cacheKey, ttl, JSON.stringify(data));
    return originalJson(data);
  };
  
  next();
};

// Usage
app.get('/users', cacheMiddleware('users', 1800), userController.getAll);
```

**Checklist:**
- [ ] Redis installed and connected
- [ ] Cache frequently accessed data
- [ ] Proper TTL for different data types
- [ ] Cache invalidation strategy

### 4. Clustering & Process Management

```javascript
// cluster.js
const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = require('./app');
  app.listen(3000);
}
```

**Checklist:**
- [ ] PM2 for process management
- [ ] Clustering for multi-core
- [ ] Proper worker restarts
- [ ] Graceful shutdown handling

---

## BACKEND - Security

### 1. Authentication & Authorization

#### JWT Implementation
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Password hashing (12 rounds)
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Verify token middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based access control
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};
```

**Checklist:**
- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] Short-lived access tokens (15 min)
- [ ] Refresh tokens for sessions
- [ ] Role-based authorization

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// Redis client for distributed rate limiting
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  skip: (req) => req.path === '/health',
});

// Strict limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: { error: 'Too many attempts, account locked for 1 hour' },
  keyGenerator: (req) => req.ip + ':' + req.body.email,
});

// Login-specific limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // 3 attempts per 15 minutes
  message: { error: 'Too many login attempts' },
  skipSuccessfulRequests: true,
});

// Apply to routes
app.use('/api/', apiLimiter);
app.post('/api/auth/login', loginLimiter, authLimiter, authController.login);
```

**Checklist:**
- [ ] Global rate limiter
- [ ] Stricter limits on auth routes
- [ ] Redis-backed for distributed systems
- [ ] Proper error messages

### 3. Input Validation

```javascript
const Joi = require('joi');

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  
  next();
};

// Usage
app.post('/api/users', validateRequest(userSchema), userController.create);
```

**Checklist:**
- [ ] Input validation on all endpoints
- [ ] Sanitize inputs
- [ ] Parameterized queries
- [ ] File upload validation

### 4. SQL/NoSQL Injection Prevention

```javascript
// MongoDB - Always use parameterized queries
// GOOD:
const user = await User.findOne({ email: req.body.email });

// BAD - Never do this:
const query = `db.users.findOne({ email: '${req.body.email}' })`;

// File path traversal prevention
const path = require('path');
const sanitizePath = (input) => {
  const normalized = path.normalize(input);
  if (normalized.includes('..')) {
    throw new Error('Invalid path');
  }
  return normalized;
};
```

**Checklist:**
- [ ] No string concatenation in queries
- [ ] Sanitize file paths
- [ ] Use ORMs/mongoose properly

### 5. Security Headers

```javascript
// Complete helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://yourapi.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['X-Total-Count'],
};
app.use(cors(corsOptions));
```

**Checklist:**
- [ ] Helmet configured
- [ ] CSP policy set
- [ ] CORS properly configured
- [ ] No exposed headers

---

## Deployment Checklist

### Environment Variables
```env
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb://user:pass@host:port/database
REDIS_URL=redis://host:port

# JWT
JWT_SECRET=64-character-random-string-here
JWT_REFRESH_SECRET=different-64-character-random-string

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Security
SESSION_SECRET=another-64-character-random-string
```

### Security Checklist
- [ ] All dependencies updated
- [ ] No known vulnerabilities (run npm audit)
- [ ] SSL/TLS configured
- [ ] Firewall rules set
- [ ] Database not exposed to internet
- [ ] API keys rotated regularly
- [ ] Backup strategy in place
- [ ] Logging & monitoring active

### Performance Checklist
- [ ] Production build optimized
- [ ] CDN configured
- [ ] Caching headers set
- [ ] Database indexes created
- [ ] Redis caching active
- [ ] Compression enabled
- [ ] Load balancer configured

---

## Quick Reference Cheat Sheet

### Frontend Performance
```javascript
// ✅ DO
const Component = memo(({ data }) => <div>{data.name}</div>);
const value = useMemo(() => expensive(data), [data]);
const fn = useCallback(() => doSomething(id), [id]);

// ❌ DON'T
<div dangerouslySetInnerHTML={userInput} />
localStorage.setItem('token', token); // for sensitive data
```

### Backend Security
```javascript
// ✅ DO
const hash = await bcrypt.hash(password, 12);
const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
app.use(rateLimit({ max: 100, windowMs: 15 * 60 * 1000 }));

// ❌ DON'T
eval(userInput); // Never
`db.users.find({ email: '${email}' })` // No string interpolation
```

---

*Last Updated: April 2026*
*Version: 1.0*
*For THE STACK GUY OS*