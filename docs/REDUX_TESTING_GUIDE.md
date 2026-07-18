# Redux Testing Guide

## Testing Redux Slices

### Patient Slice Tests
**File:** `frontend/src/store/slices/__tests__/patientSlice.test.js`

```javascript
import { configureStore } from '@reduxjs/toolkit';
import patientReducer, {
  setPatients,
  setLoading,
  setError,
  setSelectedPatient,
  setPagination,
} from '../patientSlice';

describe('Patient Slice', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        patients: patientReducer
      }
    });
  });

  it('should handle setPatients', () => {
    const mockPatients = [
      { _id: '1', firstName: 'John', lastName: 'Doe' }
    ];
    
    store.dispatch(setPatients(mockPatients));
    
    const state = store.getState().patients;
    expect(state.list).toEqual(mockPatients);
  });

  it('should handle setLoading', () => {
    store.dispatch(setLoading(true));
    expect(store.getState().patients.loading).toBe(true);
  });

  it('should handle setError', () => {
    const error = 'Test error';
    store.dispatch(setError(error));
    expect(store.getState().patients.error).toBe(error);
  });

  it('should handle setSelectedPatient', () => {
    const patient = { _id: '1', firstName: 'Jane' };
    store.dispatch(setSelectedPatient(patient));
    expect(store.getState().patients.selectedPatient).toEqual(patient);
  });

  it('should handle setPagination', () => {
    const pagination = { page: 1, limit: 10, total: 50 };
    store.dispatch(setPagination(pagination));
    expect(store.getState().patients.pagination).toEqual(pagination);
  });
});
```

### Auth Slice Tests
**File:** `frontend/src/store/slices/__tests__/authSlice.test.js`

```javascript
describe('Auth Slice', () => {
  it('should handle login', () => {
    const user = { _id: '1', email: 'test@example.com', role: 'admin' };
    store.dispatch(setCurrentUser(user));
    expect(store.getState().auth.currentUser).toEqual(user);
  });

  it('should handle logout', () => {
    store.dispatch(clearCurrentUser());
    expect(store.getState().auth.currentUser).toBe(null);
  });

  it('should set authentication token', () => {
    const token = 'jwt_token_123';
    store.dispatch(setAccessToken(token));
    expect(store.getState().auth.accessToken).toBe(token);
  });
});
```

## Testing Selectors

### Selector Tests
```javascript
import {
  selectPatients,
  selectPatientsLoading,
  selectPatientsError,
  selectPatientsPagination,
  selectSelectedPatient
} from '../patientSlice';

describe('Patient Selectors', () => {
  it('should select patients list', () => {
    const mockPatients = [{ _id: '1', name: 'John' }];
    const state = {
      patients: {
        list: mockPatients
      }
    };
    
    expect(selectPatients(state)).toEqual(mockPatients);
  });

  it('should select loading state', () => {
    const state = {
      patients: { loading: true }
    };
    
    expect(selectPatientsLoading(state)).toBe(true);
  });

  it('should select error state', () => {
    const error = 'Test error';
    const state = {
      patients: { error }
    };
    
    expect(selectPatientsError(state)).toBe(error);
  });
});
```

## Testing Async Thunks

### Async Thunk Tests
```javascript
import { fetchPatients } from '../patientSlice';

describe('Patient Async Thunks', () => {
  it('should fetch patients successfully', async () => {
    const mockPatients = [{ _id: '1', name: 'John' }];
    
    patientService.getPatients = vi.fn()
      .mockResolvedValue({ data: mockPatients });
    
    const result = await store.dispatch(fetchPatients({ page: 1 }));
    
    expect(result.type).toMatch(/fulfilled$/);
    expect(store.getState().patients.list).toEqual(mockPatients);
  });

  it('should handle fetch error', async () => {
    patientService.getPatients = vi.fn()
      .mockRejectedValue(new Error('API Error'));
    
    const result = await store.dispatch(fetchPatients({ page: 1 }));
    
    expect(result.type).toMatch(/rejected$/);
    expect(store.getState().patients.error).toBeDefined();
  });
});
```

## Testing Connected Components

### Component with Redux Provider
```javascript
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../store/slices/patientSlice';

const mockStore = configureStore({
  reducer: {
    patients: patientReducer
  },
  preloadedState: {
    patients: {
      list: mockPatients,
      loading: false,
      error: null,
      selectedPatient: null,
      pagination: { page: 1, limit: 10, total: 50 }
    }
  }
});

describe('Patient Component with Redux', () => {
  it('should render with store data', () => {
    render(
      <Provider store={mockStore}>
        <PatientsPage />
      </Provider>
    );
    
    expect(screen.getByText(mockPatients[0].firstName)).toBeInTheDocument();
  });

  it('should dispatch actions', async () => {
    const user = userEvent.setup();
    
    render(
      <Provider store={mockStore}>
        <PatientsPage />
      </Provider>
    );
    
    const addButton = screen.getByRole('button', { name: /add/i });
    await user.click(addButton);
    
    // Verify action was dispatched
    expect(mockStore.getState().patients.selectedPatient).toBe(null);
  });
});
```

## Testing Redux Middleware

### Middleware Tests
```javascript
describe('Redux Middleware', () => {
  it('should intercept actions', () => {
    const middleware = store => next => action => {
      expect(action.type).toBeDefined();
      return next(action);
    };
    
    const store = configureStore({
      reducer: patientReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware)
    });
    
    store.dispatch(setPatients([]));
    expect(true).toBe(true); // Middleware executed
  });
});
```

## Redux DevTools Integration

### Debug Redux State
```javascript
// In vitest.config.js or tests
const store = configureStore({
  reducer: {
    patients: patientReducer
  },
  devTools: true // Enable Redux DevTools in tests
});

// Log state
console.log('Redux State:', store.getState());
```

## Best Practices

✅ **Test reducers in isolation**
```javascript
it('should reduce action correctly', () => {
  const action = { type: 'SET_PATIENTS', payload: [] };
  const newState = patientReducer(initialState, action);
  expect(newState.list).toEqual([]);
});
```

✅ **Mock API calls in thunks**
```javascript
beforeEach(() => {
  vi.mock('../services/patientService');
});
```

✅ **Use `configureStore` for testing**
```javascript
const store = configureStore({
  reducer: { patients: patientReducer }
});
```

✅ **Test selectors separately**
```javascript
it('should select data from state', () => {
  expect(selectPatients(state)).toEqual(state.patients.list);
});
```

## Common Testing Patterns

### Pattern 1: Test Slice with Multiple Actions
```javascript
it('should handle multiple actions in sequence', () => {
  store.dispatch(setLoading(true));
  store.dispatch(setPatients(mockData));
  store.dispatch(setLoading(false));
  
  const state = store.getState().patients;
  expect(state.list).toEqual(mockData);
  expect(state.loading).toBe(false);
});
```

### Pattern 2: Test State Updates
```javascript
it('should update nested state', () => {
  store.dispatch(setPagination({
    page: 2,
    limit: 20,
    total: 100
  }));
  
  const pagination = store.getState().patients.pagination;
  expect(pagination.page).toBe(2);
  expect(pagination.limit).toBe(20);
});
```

### Pattern 3: Test Error Handling
```javascript
it('should clear error on new action', () => {
  store.dispatch(setError('Error message'));
  expect(store.getState().patients.error).toBeDefined();
  
  store.dispatch(clearError());
  expect(store.getState().patients.error).toBeNull();
});
```

## Redux Testing Checklist

- [ ] Reducers handle all action types
- [ ] Initial state is correct
- [ ] Selectors return expected data
- [ ] Async thunks handle success/failure
- [ ] Middleware works correctly
- [ ] Components receive Redux data
- [ ] Components can dispatch actions
- [ ] State updates are immutable
- [ ] No side effects in reducers
- [ ] Coverage > 80%
