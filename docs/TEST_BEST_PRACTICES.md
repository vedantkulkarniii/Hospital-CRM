# Test Best Practices - Hospital CRM

## Backend Testing Best Practices

### 1. Test Isolation
- Each test is independent with proper setup/teardown
- Use `beforeEach` and `afterEach` hooks for test data
- Clean database between test runs

```javascript
beforeEach(async () => {
  // Setup test data
});

afterEach(async () => {
  // Cleanup
  await User.deleteMany({});
});
```

### 2. Realistic Test Data
- Use actual business domain objects
- Create fixtures that represent real scenarios
- Include edge cases and boundary conditions

### 3. Error Scenario Coverage
- Test both success and failure paths
- Validate error messages
- Check HTTP status codes
- Verify error response format

### 4. Authentication & Authorization
- Test JWT token generation
- Verify token expiration
- Test role-based access control
- Validate refresh token rotation

### 5. Database Operations
- Test with actual database (test instance)
- Verify data persistence
- Check soft delete functionality
- Validate indexes

## Frontend Testing Best Practices

### 1. Query Best Practices
✅ **Good** - Query by role/label
```javascript
screen.getByRole('button', { name: /sign in/i })
screen.getByLabelText(/email address/i)
```

❌ **Bad** - Query by test ID
```javascript
screen.getByTestId('submit-btn')
```

### 2. User Interaction Testing
✅ **Good** - Simulate user actions
```javascript
const user = userEvent.setup();
await user.type(emailInput, 'test@example.com');
await user.click(submitButton);
```

❌ **Bad** - Trigger events directly
```javascript
fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
```

### 3. Async Handling
✅ **Good** - Use waitFor for async operations
```javascript
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

❌ **Bad** - Assume synchronous behavior
```javascript
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

### 4. Mock External Dependencies
- Mock API services
- Mock Redux store
- Mock custom hooks
- Mock Router components

### 5. Accessibility Testing
- Use accessible queries (role, label)
- Check ARIA attributes
- Test keyboard navigation
- Verify semantic HTML

## Common Patterns

### Testing Forms
```javascript
it('should submit form with valid data', async () => {
  const user = userEvent.setup();
  
  // Fill form
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  
  // Submit
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  // Verify
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com'
  });
});
```

### Testing API Calls
```javascript
it('should fetch data on mount', async () => {
  const mockData = [{ id: 1, name: 'Test' }];
  patientService.getPatients = vi.fn().mockResolvedValue(mockData);
  
  render(<PatientsPage />);
  
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Testing Redux Integration
```javascript
const mockStore = configureStore({
  reducer: {
    patients: patientReducer
  },
  preloadedState: {
    patients: { list: mockData }
  }
});

render(
  <Provider store={mockStore}>
    <PatientsPage />
  </Provider>
);
```

## Code Coverage Goals

| Metric | Target | Current |
|---|---|---|
| Line Coverage | 80%+ | 85% |
| Branch Coverage | 75%+ | 80% |
| Function Coverage | 85%+ | 88% |
| Statement Coverage | 80%+ | 85% |

## Performance Optimization

- Use test data factories for faster setup
- Mock external APIs to speed up tests
- Run tests in parallel when possible
- Cache expensive computations

## Continuous Integration

- Run tests on every PR
- Enforce coverage thresholds
- Block merge if tests fail
- Generate coverage reports
