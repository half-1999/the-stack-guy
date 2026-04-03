# New Project Checklist - Security, Performance, Caching & Rate Limiting

## Pre-Development Setup

### 1. Project Initialization
- [ ] Initialize with `npm init` or use Vite for React
- [ ] Set up TypeScript from day one (recommended)
- [ ] Configure ESLint + Prettier for code consistency
- [ ] Set up Husky + lint-staged for pre-commit hooks
- [ ] Configure .env.example and .gitignore

### 2. Repository & CI/CD
- [ ] Initialize Git repository with proper branch strategy (main/dev/feature)
- [ ] Set up GitHub Actions or similar for CI/CD pipeline
- [ ] Configure automated testing in CI pipeline
- [ ] Set up code coverage reporting

---

## Backend (Node.js/Express) - Security Essentials

### 1. Security Headers & CORS
```javascript
// helmet.js - Security headers
const helmet = require('helmet');
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

- [ ] Install and configure `helmet` middleware
- [ ] Set up proper CORS with whitelist
- [ ] Configure Content Security Policy (CSP)
- [ ] Set X-Frame-Options to prevent clickjacking

### 2. Authentication & Authorization
- [ ] Use JWT with short expiration (15 min access, 7 day refresh)
- [ ] Implement refresh token rotation
- [ ] Store refresh tokens in HTTP-only cookies
- [ ] Hash passwords with bcrypt (12+ rounds)
- [ ] Implement role-based access control (RBAC)
- [ ] Add rate limiting on login attempts
- [ ] Add 2FA option for sensitive accounts

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

// General API limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Strict limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: 'Too many login attempts, account locked'
});
```

- [ ] Apply global rate limiter
- [ ] Apply strict rate limiting on auth endpoints
- [ ] Implement IP-based blocking for repeated violations
- [ ] Add rate limiting for file uploads
- [ ] Use Redis for distributed rate limiting

### 4. Input Validation & Sanitization
- [ ] Use Zod or Joi for schema validation
- [ ] Sanitize all user inputs to prevent XSS
- [ ] Parameterized queries to prevent SQL injection
- [ ] Validate file upload types and sizes
- [ ] Sanitize file paths to prevent directory traversal

### 5. API Security
- [ ] Implement request size limits (10MB max)
- [ ] Add timeout for long-running requests
- [ ] Disable server banner (hide X-Powered-By)
- [ ] Use secure HTTP cookies (Secure, HttpOnly, SameSite)
- [ ] Implement CSRF tokens for state-changing operations

---

## Backend (Node.js) - Performance Optimization

### 1. Database Optimization
- [ ] Add indexes on frequently queried fields
- [ ] Use connection pooling (pg-pool for PostgreSQL, mongoose for MongoDB)
- [ ] Implement database query caching
- [ ] Use lean() for Mongoose when you don't need full documents
- [ ] Implement pagination for large datasets
- [ ] Use aggregation pipelines for complex queries
- [ ] Set up database connection limits

### 2. Caching Strategy
```javascript
// Redis caching example
const redisClient = redis.createClient();
redisClient.connect();

const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = req.originalUrl;
  const cached = await redisClient.get(key);
  if (cached) return res.json(JSON.parse(cached));
  
  // Store original json method
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    redisClient.setEx(key, duration, JSON.stringify(data));
    return originalJson(data);
  };
  next();
};
```

- [ ] Implement Redis for session management
- [ ] Cache expensive API responses
- [ ] Use ETags for conditional requests
- [ ] Set up CDN for static assets
- [ ] Implement HTTP cache headers (Cache-Control)

### 3. Node.js Performance
- [ ] Use clustering for multi-core utilization
- [ ] Implement PM2 for process management
- [ ] Set NODE_ENV to production
- [ ] Enable Gzip compression
- [ ] Use streaming for large file responses
- [ ] Implement request/response compression
- [ ] Use async/await properly (avoid blocking)

### 4. Memory & Resource Management
- [ ] Monitor memory usage with clinic.js
- [ ] Implement graceful shutdown handling
- [ ] Set up proper error logging (Winston + Morgan)
- [ ] Use process.on('unhandledRejection') handlers
- [ ] Implement health check endpoints

---

## Backend - Advanced Configuration

### 1. Load Balancing
- [ ] Set up Nginx as reverse proxy
- [ ] Configure upstream servers
- [ ] Enable sticky sessions if needed
- [ ] Set up SSL/TLS termination

### 2. Monitoring & Logging
- [ ] Integrate Sentry or similar for error tracking
- [ ] Set up Prometheus + Grafana for metrics
- [ ] Use Winston for structured logging
- [ ] Configure log rotation (daily + size-based)
- [ ] Set up alerting for critical errors

### 3. Environment Configuration
```env
# Environment variables checklist
NODE_ENV=production
PORT=3000
DATABASE_URL=...
REDIS_URL=...
JWT_SECRET= # 64+ character random string
JWT_REFRESH_SECRET= # Different from JWT_SECRET
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

- [ ] Use environment-specific configs
- [ ] Never commit secrets to git
- [ ] Use secret management (AWS Secrets, HashiCorp Vault)
- [ ] Validate all required env vars on startup

---

## Frontend (React/Vite) - Security

### 1. XSS Prevention
- [ ] Use React's built-in XSS protection
- [ ] Sanitize any HTML content with DOMPurify
- [ ] Avoid dangerouslySetInnerHTML unless necessary
- [ ] Use proper encoding in URLs

### 2. Authentication
- [ ] Store tokens in memory (not localStorage for sensitive apps)
- [ ] Use HTTP-only cookies for JWT storage
- [ ] Implement token refresh mechanism
- [ ] Clear tokens on logout completely

### 3. API Security
- [ ] Implement request/response interceptors
- [ ] Add CSRF tokens to requests
- [ ] Validate all API responses
- [ ] Handle errors gracefully without exposing internals

---

## Frontend - Performance Optimization

### 1. Bundle Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'lodash'],
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
  }
})
```

- [ ] Code splitting with React.lazy()
- [ ] Implement route-based chunking
- [ ] Use tree-shaking for unused code
- [ ] Minify and compress build output
- [ ] Remove console.logs in production

### 2. Image & Asset Optimization
- [ ] Use WebP format with fallbacks
- [ ] Implement lazy loading for images
- [ ] Use responsive images (srcset)
- [ ] Compress all assets before deployment
- [ ] Use SVG icons (better than font icons)

### 3. Rendering Optimization
- [ ] Use React.memo() for expensive components
- [ ] Implement useMemo() for expensive calculations
- [ ] Use useCallback() for callback functions
- [ ] Virtualize long lists with react-window
- [ ] Avoid unnecessary re-renders

### 4. State Management
- [ ] Use React Query or SWR for server state
- [ ] Implement proper cache invalidation
- [ ] Keep client state minimal
- [ ] Use context for truly global state only

---

## Infrastructure & DevOps

### 1. Docker Setup
- [ ] Use multi-stage builds for smaller images
- [ ] Set non-root user in containers
- [ ] Implement health checks
- [ ] Use .dockerignore properly

### 2. Security Scanning
- [ ] Run npm audit regularly
- [ ] Use Snyk or similar for dependency scanning
- [ ] Implement container scanning
- [ ] Set up vulnerability alerts

### 3. Backup & Recovery
- [ ] Automated database backups
- [ ] Test backup restoration process
- [ ] Off-site backup storage
- [ ] Document recovery procedures

---

## Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] Domain properly configured
- [ ] CDN configured for static assets
- [ ] Monitoring and alerting active
- [ ] Log aggregation working
- [ ] Backup jobs scheduled
- [ ] Performance baseline established
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Error pages customized
- [ ] SEO meta tags configured
- [ ] PWA manifest set up (if needed)

---

## Security Testing Checklist

- [ ] Run OWASP ZAP for vulnerability scanning
- [ ] Perform penetration testing
- [ ] Test rate limiting bypass attempts
- [ ] Verify XSS protection
- [ ] Test SQL injection prevention
- [ ] Verify authentication bypass attempts
- [ ] Test CSRF protection
- [ ] Verify file upload security
- [ ] Check for information disclosure

---

*Last Updated: April 2026*
*Version: 1.0*