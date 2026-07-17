# React Hooks Testing Guide

## Custom Hooks in Hospital CRM

### useAuth Hook
**File:** `frontend/src/hooks/useAuth.js`

Testing strategies:
```javascript
// Mock the hook
vi.mock('../hooks/useAuth');

// Setup mock return value
useAuthModule.useAuth.mockReturnValue({
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  isLoading: false,
  currentUser: { id: '1', role: 'admin' },
  error: null,
});
```

### useFetch Hook
**File:** `frontend/src/hooks/useFetch.js`

Testing for data fetching:
```javascript
// Mock API response
apiService.get = vi.fn().mockResolvedValue({
  data: mockData
});

// Test hook behavior
const { data, loading, error } = useFetch('/api/patients');
await waitFor(() => {
  expect(data).toBeDefined();
});
```

### useState Hook Testing
```javascript
// Test component using useState
it('should update state on input change', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const input = screen.getByRole('textbox');
  await user.type(input, 'test value');
  
  expect(input).toHaveValue('test value');
});
```

### useEffect Hook Testing
```javascript
// Test side effects
it('should fetch data on mount', async () => {
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalled();
  });
});
```

### useReducer Hook Testing
```javascript
// Test reducer with dispatch
it('should handle reducer actions', async () => {
  render(<MyComponent />);
  
  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);
  
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

### useCallback Hook Testing
```javascript
// Verify callback memoization
it('should memoize callback', () => {
  const { rerender } = render(<MyComponent />);
  const callback1 = screen.getByTestId('callback');
  
  rerender(<MyComponent />);
  const callback2 = screen.getByTestId('callback');
  
  expect(callback1).toBe(callback2);
});
```

### useMemo Hook Testing
```javascript
// Test memoized values
it('should memoize expensive computation', () => {
  const { rerender } = render(<MyComponent value={1} />);
  const result1 = screen.getByText(/result:/);
  
  rerender(<MyComponent value={1} />);
  const result2 = screen.getByText(/result:/);
  
  expect(result1).toBe(result2);
});
```

## Testing Redux Hooks

### useSelector Hook
```javascript
it('should select data from store', () => {
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
      <MyComponent />
    </Provider>
  );
  
  expect(screen.getByText(mockData[0].name)).toBeInTheDocument();
});
```

### useDispatch Hook
```javascript
it('should dispatch actions', async () => {
  const user = userEvent.setup();
  render(
    <Provider store={mockStore}>
      <MyComponent />
    </Provider>
  );
  
  const button = screen.getByRole('button', { name: /fetch/i });
  await user.click(button);
  
  await waitFor(() => {
    expect(mockStore.getState().patients.loading).toBe(false);
  });
});
```

## Testing Custom Hooks Pattern

### Pattern 1: Hook that returns state
```javascript
export const useCounter = () => {
  const [count, setCount] = useState(0);
  
  return {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
  };
};

// Test
it('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Pattern 2: Hook that fetches data
```javascript
export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
};

// Test
it('should fetch user', async () => {
  const { result } = renderHook(() => useUser('123'));
  
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeDefined();
  });
});
```

## Testing Hook Dependencies

```javascript
// Test dependency arrays
it('should update when dependency changes', async () => {
  const { rerender } = renderHook(
    ({ userId }) => useUser(userId),
    { initialProps: { userId: '1' } }
  );
  
  const user1 = result.current.user;
  
  rerender({ userId: '2' });
  
  const user2 = result.current.user;
  
  expect(user1).not.toBe(user2);
});
```

## Common Hook Testing Patterns

### 1. Testing Hook Errors
```javascript
it('should handle errors', async () => {
  apiService.get = vi.fn().mockRejectedValue(new Error('Failed'));
  
  const { result } = renderHook(() => useFetch('/api/data'));
  
  await waitFor(() => {
    expect(result.current.error).toBeDefined();
  });
});
```

### 2. Testing Hook Cleanup
```javascript
it('should cleanup on unmount', () => {
  const cleanup = vi.fn();
  
  const { unmount } = renderHook(() => {
    useEffect(() => cleanup, []);
  });
  
  unmount();
  
  expect(cleanup).toHaveBeenCalled();
});
```

### 3. Testing Hook with Initial State
```javascript
it('should initialize with correct state', () => {
  const { result } = renderHook(() => useCounter(10));
  
  expect(result.current.count).toBe(10);
});
```

## Best Practices

✅ Test behavior, not implementation  
✅ Use `renderHook` from @testing-library/react  
✅ Wrap state updates with `act()`  
✅ Test dependencies array changes  
✅ Mock external API calls  
✅ Clean up after tests  
✅ Test error scenarios  

## Common Issues

### Issue 1: "not wrapped in act(...)"
**Solution:**
```javascript
import { act } from '@testing-library/react';

act(() => {
  result.current.handleClick();
});
```

### Issue 2: Hook dependency warning
**Solution:**
Verify dependency array in hook definition

### Issue 3: Async state updates failing
**Solution:**
Use `waitFor()` for async updates:
```javascript
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```
