# Performance Optimization Guide — Hospital CRM

## Database Optimization

### Query Optimization
```javascript
// ❌ Inefficient: Multiple queries
const user = await User.findById(userId);
const patients = await Patient.find({ userId: user._id });

// ✅ Efficient: Single query with populate
const user = await User.findById(userId).populate('patients');

// ❌ Inefficient: No pagination
const allAppointments = await Appointment.find();

// ✅ Efficient: Paginated query
const appointments = await Appointment.find()
  .limit(10)
  .skip((page - 1) * 10)
  .lean();
```

### Indexing Strategy
```javascript
// Add indexes on frequently queried fields
userSchema.index({ email: 1 });
patientSchema.index({ userId: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
billSchema.index({ status: 1, createdAt: -1 });

// Check index usage
db.collection.aggregate([{ $indexStats: {} }]);
```

### Connection Pooling
```javascript
// Configure MongoDB connection pooling
mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 45000
});
```

## Backend Optimization

### Response Compression
```javascript
// Enable gzip compression
const compression = require('compression');
app.use(compression());

// Compress responses > 1KB
app.use(compression({ threshold: 1024 }));
```

### Caching Strategy
```javascript
// Cache frequently accessed data
const cache = new Map();

async function getCachedDashboard(userId) {
  const cacheKey = `dashboard-${userId}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const data = await fetchDashboardData(userId);
  cache.set(cacheKey, data);
  
  // Expire cache after 5 minutes
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
  
  return data;
}
```

### Request Rate Limiting
```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

## Frontend Optimization

### Code Splitting
```javascript
// ✅ Lazy load routes
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### Component Memoization
```javascript
// Prevent unnecessary re-renders
const PatientCard = React.memo(({ patient, onSelect }) => (
  <div onClick={() => onSelect(patient)}>
    {patient.name}
  </div>
));

// With custom comparison
const UserList = React.memo(
  ({ users }) => <div>{users.map(u => <User key={u.id} user={u} />)}</div>,
  (prevProps, nextProps) => prevProps.users.length === nextProps.users.length
);
```

### Lazy Loading
```javascript
// Load images on demand
<img 
  src={placeholder} 
  data-src={actual} 
  loading="lazy"
/>

// Intersection Observer for visibility
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('img').forEach(img => observer.observe(img));
```

### Bundle Size Reduction
```bash
# Analyze bundle
npm run build -- --report

# Tree-shake unused code
// In vite.config.js
export default {
  build: {
    rollupOptions: {
      treeshake: true
    }
  }
}

# Use dynamic imports
const chart = await import('recharts');
```

## API Optimization

### Pagination
```javascript
// Implement consistent pagination
app.get('/api/patients', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;
  
  const total = await Patient.countDocuments();
  const patients = await Patient.find()
    .limit(limit)
    .skip(skip);
  
  res.json({
    data: patients,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
```

### Field Selection
```javascript
// Return only needed fields
const user = await User.findById(userId).select('firstName lastName email');

// In API response
app.get('/api/users', async (req, res) => {
  const fields = req.query.fields?.split(',') || ['firstName', 'lastName'];
  const users = await User.find().select(fields);
  res.json(users);
});
```

### Batch Operations
```javascript
// Batch multiple operations
const operations = [
  { updateOne: { filter: { id: 1 }, update: { status: 'active' } } },
  { updateOne: { filter: { id: 2 }, update: { status: 'inactive' } } },
  { updateOne: { filter: { id: 3 }, update: { status: 'active' } } }
];

await collection.bulkWrite(operations);
```

## Monitoring & Metrics

### Performance Monitoring
```javascript
// Measure API response times
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path}: ${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn(`Slow request: ${req.method} ${req.path} (${duration}ms)`);
    }
  });
  
  next();
});
```

### Frontend Performance
```javascript
// Measure Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Caching Headers

### HTTP Caching
```javascript
// Cache static assets
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));

// Set cache headers
app.get('/api/constants', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(constants);
});
```

## Performance Checklist

### Backend
- [ ] Database indexes created
- [ ] Queries optimized
- [ ] Pagination implemented
- [ ] Compression enabled
- [ ] Caching strategy defined
- [ ] Rate limiting configured
- [ ] Connection pooling set
- [ ] Slow queries identified
- [ ] Database statistics updated
- [ ] Monitoring active

### Frontend
- [ ] Code splitting implemented
- [ ] Routes lazy loaded
- [ ] Components memoized
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Minification enabled
- [ ] Gzip compression set
- [ ] Cache headers configured
- [ ] CDN configured
- [ ] Performance monitored

## Benchmarks

### Target Metrics
```
API Response Time: < 200ms
Page Load Time: < 2 seconds
First Contentful Paint (FCP): < 1.8s
Largest Contentful Paint (LCP): < 2.5s
Cumulative Layout Shift (CLS): < 0.1
Bundle Size: < 500KB (gzipped)
```

### Monitoring Tools
- Lighthouse
- WebPageTest
- New Relic
- Datadog
- Sentry
