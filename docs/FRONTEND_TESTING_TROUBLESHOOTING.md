# Frontend Testing Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: `npm install` Fails with Peer Dependency Conflicts

**Error:**
```
npm error ERESOLVE unable to resolve dependency tree
npm error Found: react@19.2.7
npm error Could not resolve dependency:
npm error peer react@"^18.0.0" from @testing-library/react
```

**Solution:**
```bash
npm install --legacy-peer-deps
```

**Explanation:** React 19 is newer than what @testing-library/react expects. Using `--legacy-peer-deps` allows the installation to proceed while respecting the existing React version.

---

### Issue 2: Vite Native Binding Error

**Error:**
```
Error: Cannot find native binding
rolldown-binding.win32-x64-msvc.node is not a valid Win32 application
```

**Solution:**
```bash
# Remove existing installations
rm -r node_modules
rm package-lock.json

# Reinstall
npm install --legacy-peer-deps
```

**Explanation:** Native bindings got corrupted. Clean installation resolves the issue.

---

### Issue 3: Tests Timeout

**Error:**
```
Timeout - Async callback was not invoked within the 5000ms timeout specified
```

**Solution:**
```javascript
// Option 1: Increase timeout for specific test
it('slow test', async () => {
  // test code
}, 10000);

// Option 2: Configure in vitest.config.js
export default defineConfig({
  test: {
    testTimeout: 10000
  }
});
```

---

### Issue 4: Import Path Not Found

**Error:**
```
Module not found: Can't resolve '@/pages/LoginPage'
```

**Solution:**
Ensure vitest.config.js has path alias configured:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

### Issue 5: localStorage Mock Not Working

**Error:**
```
ReferenceError: localStorage is not defined
```

**Solution:**
Ensure setup.js is properly configured:
```javascript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;
```

---

### Issue 6: window.matchMedia Not Mocked

**Error:**
```
TypeError: window.matchMedia is not a function
```

**Solution:**
Add to setup.js:
```javascript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

### Issue 7: Tests Not Found

**Error:**
```
No test files found, exiting with status 1
```

**Solution:**
Ensure test files match pattern in vitest.config.js:
```javascript
include: ['src/**/*.test.{js,jsx}', 'src/**/*.spec.{js,jsx}'],
```

File naming: `Component.test.jsx` or `Component.spec.jsx`

---

### Issue 8: Redux Store Not Provided in Tests

**Error:**
```
Could not find react-redux context value; please ensure the component is wrapped in a <Provider>
```

**Solution:**
Wrap component in Redux Provider:
```javascript
const mockStore = configureStore({
  reducer: { /* reducers */ }
});

render(
  <Provider store={mockStore}>
    <YourComponent />
  </Provider>
);
```

---

### Issue 9: useAuth Hook Not Mocked

**Error:**
```
TypeError: useAuth is not a function
```

**Solution:**
Mock the hook in test file:
```javascript
import * as useAuthModule from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

beforeEach(() => {
  useAuthModule.useAuth.mockReturnValue({
    login: vi.fn(),
    isLoading: false,
  });
});
```

---

### Issue 10: Async Operations Not Waiting

**Error:**
```
Expected element to be in the document
```

**Solution:**
Use `waitFor` for async operations:
```javascript
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

---

## Performance Tips

### 1. Test Execution Speed
```bash
# Run tests in parallel (default)
npm test

# Run single-threaded (slower)
npm test -- --no-threads
```

### 2. Watch Specific Files
```bash
npm test -- --watch src/pages/LoginPage.test.jsx
```

### 3. Skip Tests
```javascript
it.skip('slow test', () => {
  // This test won't run
});
```

### 4. Focus on Specific Tests
```javascript
it.only('important test', () => {
  // Only this test will run
});
```

---

## Debugging Tips

### 1. Print Component Output
```javascript
import { screen } from '@testing-library/react';

render(<Component />);
screen.debug(); // Prints entire DOM
screen.debug(screen.getByRole('button'));
```

### 2. Check Available Queries
```javascript
render(<Component />);
screen.logTestingPlaygroundURL(); // Opens testing playground
```

### 3. Run Tests with Verbose Output
```bash
npm test -- --reporter=verbose
```

### 4. Use Test UI for Debugging
```bash
npx vitest --ui
```

---

## Coverage Issues

### Not Capturing All Coverage

**Solution:**
Ensure coverage config in vitest.config.js:
```javascript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: ['node_modules/', 'setup.js'],
}
```

### Dependencies Not Installed for Coverage

```bash
npm install -D @vitest/coverage-v8
```

---

## Help & Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io)
