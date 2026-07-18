# Frontend Bundle Optimization — Phase 13 T-204

## Overview

This document details the bundle optimization implementation for the Hospital CRM frontend. The goal is to reduce initial bundle size and improve application performance through code splitting, lazy loading, and strategic vendor chunking.

## Optimizations Implemented

### 1. Code Splitting Strategy

#### Vendor Chunking
The application splits vendor libraries into focused chunks based on functionality:

- **vendor-react**: Core React ecosystem (react, react-dom, react-router-dom)
- **vendor-redux**: State management (redux, react-redux, @reduxjs/toolkit)
- **vendor-ui**: UI and visualization (lucide-react, recharts)
- **vendor-http**: HTTP client (axios)
- **vendor-utils**: Utility libraries (date-fns, lodash)

**Benefits:**
- Reduces initial bundle size
- Enables better browser caching (vendor chunks change less frequently)
- Allows parallel loading of chunks
- Improved time-to-interactive (TTI)

### 2. Route-Level Code Splitting

All page components are lazily loaded:

```jsx
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.jsx'));
const PatientsPage = lazy(() => import('./pages/dashboard/PatientsPage.jsx'));
const AppointmentsPage = lazy(() => import('./pages/dashboard/AppointmentsPage.jsx'));
// ... more pages
```

**Benefits:**
- Only loads code for routes user navigates to
- Reduces initial download
- Parallel loading of multiple routes

### 3. Lazy Load Utility

Created `/src/utils/lazyLoad.js` for consistent lazy loading patterns:

```javascript
// Generic wrapper
export const lazyLoad = (importFn) => { ... }

// Page-specific loader
export const lazyLoadPage = (importFn) => { ... }

// Component fallback UI
export function LazyComponentLoader() { ... }
```

**Usage:**
```jsx
// Option 1: Direct lazy() with Suspense (current approach)
const Component = lazy(() => import('./Component.jsx'));

// Option 2: Using utility
const Component = lazyLoad(() => import('./Component.jsx'));
```

### 4. Build Optimization Configuration

#### Minification
- Uses esbuild for fast minification (default Vite behavior)
- Removes development code and comments
- Optimizes constant folding and dead code elimination

#### CSS Handling
- PostCSS pipeline configured
- Tailwind CSS automatically purges unused styles
- CSS is inlined for critical styles in production

#### Source Maps
- Disabled in production to reduce bundle size
- Can be re-enabled for debugging by setting `sourcemap: true`

#### Chunk Size Warning
- Threshold set at 500 KB to alert on large chunks
- Helps identify optimization opportunities

### 5. Bundle Analysis

#### Generating Reports
```bash
npm run build:analyze
```

This command:
1. Runs a production build
2. Generates `dist/stats.html` with visual bundle analysis
3. Open the HTML file in a browser to see:
   - Chunk sizes (gzipped and ungzipped)
   - Module breakdown
   - Duplicate packages
   - Load order

#### Interpreting the Report
- **Red modules**: Large, consider splitting or lazy loading
- **Duplicate packages**: Indicates version conflicts (use npm audit)
- **Load order**: First chunks are loaded first

## Performance Metrics

### Expected Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial Bundle | ~400 KB | ~280 KB | -30% |
| Initial JS | ~350 KB | ~200 KB | -43% |
| First Contentful Paint | ~2.5s | ~1.8s | -28% |
| Time to Interactive | ~4.5s | ~2.8s | -38% |
| Largest Contentful Paint | ~3.0s | ~2.0s | -33% |

*Estimates based on typical React SPA optimizations*

## Configuration Files

### `frontend/vite.config.js`
- Main Vite configuration
- Defines code splitting strategy
- Configures build optimization
- Includes visualizer plugin

### `frontend/package.json`
- Added `build:analyze` script
- Added `rollup-plugin-visualizer` dependency

### `frontend/src/utils/lazyLoad.js`
- Lazy loading utility functions
- Consistent loading fallback UI

## Best Practices for Maintaining Optimization

### DO's
✅ Keep vendor chunks stable (don't add/remove dependencies unnecessarily)
✅ Use lazy loading for all route pages
✅ Monitor bundle size in CI/CD pipeline
✅ Use React.memo for expensive components
✅ Profile with Chrome DevTools Performance tab
✅ Run `npm run build:analyze` before major releases

### DON'Ts
❌ Don't import entire libraries when you only need one function
❌ Avoid large synchronous modules on initial page load
❌ Don't create routes with huge component files
❌ Avoid circular dependencies
❌ Don't include development-only packages in production builds

## Future Optimizations

### Potential Next Steps
1. **Dynamic Imports for Components**: Lazy load feature-specific components
2. **Image Optimization**: Use WebP with JPEG fallbacks, responsive images
3. **Service Worker**: Implement offline support and intelligent caching
4. **Tree Shaking**: Audit components for unused exports
5. **Compression**: Enable Gzip/Brotli compression at server level
6. **CDN Integration**: Serve static assets from CDN
7. **Module Federation**: If building micro-frontends

## Monitoring & Debugging

### Check Bundle Size in Dev
```bash
npm run build
# Check dist/ folder sizes
```

### Analyze Specific Module
```javascript
// In vite.config.js, modify visualizer options:
visualizer({
  open: true,  // Automatically opens HTML report
  gzipSize: true,  // Show gzipped size
  brotliSize: true,  // Show brotli size
})
```

### Performance Testing
```bash
# Lighthouse audit
npm run build && npm run preview
# Open http://localhost:4173 and run Lighthouse
```

## Related Documentation

- Vite Official Docs: https://vitejs.dev/guide/features.html#code-splitting
- React Lazy Loading: https://react.dev/reference/react/lazy
- Web.dev Performance: https://web.dev/performance/

## Rollback Instructions

If you need to disable these optimizations:
1. Remove `rollupOptions` from `vite.config.js`
2. Remove `visualizer` plugin
3. Change lazy-loaded components back to direct imports
4. Run `npm run build` again

## Troubleshooting

### Large Chunks Not Splitting
**Issue**: Expected chunks still large after splitting
**Solution**: 
- Check if dependencies have duplicate versions: `npm list`
- Run `npm audit fix` to resolve conflicts
- Verify manualChunks configuration in vite.config.js

### Lazy Loading Causing Flicker
**Issue**: Loading states cause UI flicker
**Solution**:
- Increase initial chunk with critical components
- Use higher-order component pattern for route components
- Add loading skeleton components

### Visualizer Plugin Error
**Issue**: `dist/stats.html` not generated
**Solution**:
- Ensure `rollup-plugin-visualizer` is installed: `npm install --save-dev rollup-plugin-visualizer`
- Check vite.config.js has correct plugin configuration
- Check dist/ folder has write permissions

---

**Last Updated**: July 18, 2026
**Task**: T-204 — Frontend Bundle Optimization
**Phase**: Phase 13 — Optimization
