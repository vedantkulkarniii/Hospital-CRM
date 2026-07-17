# Troubleshooting Guide — Hospital CRM

## Common Issues & Solutions

## Table of Contents
1. [Setup Issues](#setup-issues)
2. [Runtime Issues](#runtime-issues)
3. [Database Issues](#database-issues)
4. [Frontend Issues](#frontend-issues)
5. [API Issues](#api-issues)
6. [Testing Issues](#testing-issues)

---

## Setup Issues

### npm install fails

**Problem:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
npm install --legacy-peer-deps
```

**Explanation:** React 19 compatibility with older peer dependencies.

---

### .env file not found

**Problem:** `Error: ENOENT: no such file or directory, open '.env'`

**Solution:**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

---

### MongoDB not running

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Start MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo
```

---

## Runtime Issues

### Port already in use

**Problem:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Option 1: Kill existing process
lsof -i :5000
kill -9 <PID>

# Option 2: Use different port
PORT=5001 npm run dev
```

---

### Too many login attempts

**Problem:** `HTTP 429: Too many auth attempts`

**Solution:**
- Wait 15 minutes OR
- Disable rate limiter in development (already done)

---

### Token errors

**Problem:** `JWT verify error` or `secretOrPrivateKey must have a value`

**Solution:**
1. Verify `.env` exists with JWT secrets
2. Check secrets are not empty
3. Restart server after .env changes

---

## Database Issues

### Duplicate key error

**Problem:** `E11000 duplicate key error collection`

**Solution:**
```bash
# Reset test data
cd backend
npm run seed
```

---

### Connection timeout

**Problem:** `MongooseError: operation timed out`

**Solution:**
1. Check MongoDB is running
2. Verify MONGO_URI is correct
3. Check network connectivity
4. Increase timeout:
   ```javascript
   mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
   ```

---

### Query returns no results

**Problem:** Data exists but query returns empty

**Solution:**
```javascript
// Check indexes
db.collection.getIndexes()

// Rebuild if needed
db.collection.reIndex()

// Check field names (case-sensitive)
db.collection.findOne()
```

---

## Frontend Issues

### Page not loading

**Problem:** Blank page, no errors

**Solution:**
1. Check browser console for errors
2. Check network tab in DevTools
3. Clear cache: Ctrl+Shift+Delete
4. Reload: Ctrl+F5

---

### Components not rendering

**Problem:** Component doesn't appear

**Solution:**
```javascript
// Check props
console.log('Props:', props);

// Check state
console.log('State:', state);

// Check conditional rendering
{showComponent && <Component />}

// Check CSS
// Inspect element for display: none
```

---

### API calls failing

**Problem:** 404, 500, or timeout errors

**Solution:**
1. Check backend is running
2. Verify API endpoint URL
3. Check request headers
4. Check authentication token
5. Review backend logs

---

### Redux state not updating

**Problem:** State unchanged after dispatch

**Solution:**
```javascript
// Check action is dispatched
console.log('Dispatching:', action);

// Check reducer receives action
console.log('Action in reducer:', action);

// Check selector returns updated state
console.log('Selected state:', useSelector(selectState));

// Verify store is passed to Provider
<Provider store={store}>
```

---

## API Issues

### 401 Unauthorized

**Problem:** `Unauthorized` error

**Solution:**
1. Check authentication token in headers
2. Verify token is valid (not expired)
3. Check `Authorization: Bearer <token>`
4. Re-login to get new token

---

### 403 Forbidden

**Problem:** `Forbidden` error

**Solution:**
1. Check user role has permission
2. Verify RBAC implementation
3. Check middleware is applied
4. Review authorization logic

---

### 404 Not Found

**Problem:** `Resource not found` error

**Solution:**
1. Verify API endpoint exists
2. Check resource ID is valid
3. Verify resource wasn't deleted
4. Check URL spelling

---

### 500 Internal Server Error

**Problem:** `Internal Server Error`

**Solution:**
1. Check backend logs
2. Verify database connection
3. Check for syntax errors
4. Review error middleware
5. Restart server

---

### CORS error

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
```javascript
// In app.js
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## Testing Issues

### Tests not running

**Problem:** `No test files found`

**Solution:**
```bash
# Check test file naming
# Should be: *.test.js or *.spec.js

# Check path in jest.config.js
testMatch: ['**/__tests__/**/*.test.js']
```

---

### MongoDB memory server error

**Problem:** `Cannot find native binding`

**Solution:**
```bash
# For tests, ensure MongoDB is running
mongod

# Or use test database URI in .env
MONGO_URI=mongodb://localhost:27017/hospital_crm_test
```

---

### Timeout errors in tests

**Problem:** `Timeout - Async callback not invoked`

**Solution:**
```javascript
// Increase timeout
it('test', async () => {
  // test code
}, 10000); // 10 seconds

// Or in config
testTimeout: 10000
```

---

### Tests passing locally but failing in CI

**Problem:** Environment differences

**Solution:**
1. Verify environment variables in CI
2. Check database setup in CI
3. Compare Node versions
4. Check for missing dependencies

---

## Debugging Tips

### Enable Debug Logging
```bash
# Backend
DEBUG=* npm run dev

# Frontend
Inspect element → Console
```

### Check Application Logs
```bash
# Backend logs
tail -f logs/app.log
tail -f logs/error.log

# Frontend logs
Browser console (F12)
```

### Use Browser DevTools
1. **Console** - Check for JavaScript errors
2. **Network** - Check API requests
3. **Application** - Check localStorage/cookies
4. **Performance** - Check for bottlenecks
5. **Elements** - Inspect HTML structure

### Backend Debugging
```javascript
// Add console logs
console.log('User:', user);

// Use debugger
debugger;
// Run with: node --inspect app.js

// Check route matching
app.all('*', (req, res) => {
  console.log(`${req.method} ${req.path}`);
});
```

---

## Performance Issues

### Slow API responses

**Problem:** API takes > 1 second

**Solution:**
1. Check database indexes
2. Optimize queries
3. Implement caching
4. Check server resources

---

### Slow page load

**Problem:** Page takes > 3 seconds

**Solution:**
1. Check bundle size: `npm run build -- --report`
2. Implement code splitting
3. Optimize images
4. Check network requests

---

## Getting More Help

### Resources
- Check existing issues: https://github.com/vedantkulkarniii/Hospital-CRM/issues
- Read documentation: Check docs/ folder
- Enable verbose logging
- Check error messages carefully

### When Asking for Help
Include:
1. Error message (full text)
2. Steps to reproduce
3. What you've tried
4. Your environment (OS, Node version, etc.)
5. Relevant logs/screenshots

---

## Still Stuck?

1. Google the error message
2. Check StackOverflow
3. Review documentation
4. Open a GitHub issue
5. Ask for community help

**You got this! 💪**
