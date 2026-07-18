import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/index.js';
import QueryClientProviderComponent from './providers/QueryClientProvider.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProviderComponent>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#111827',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProviderComponent>
    </Provider>
  </StrictMode>,
);
