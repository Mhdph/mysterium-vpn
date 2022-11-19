import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import {QueryClientProvider, QueryClient} from 'react-query';
import {StyledEngineProvider} from '@mui/material';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClinet = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClinet}>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <ToastContainer />
          <App />
        </BrowserRouter>
      </StyledEngineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
