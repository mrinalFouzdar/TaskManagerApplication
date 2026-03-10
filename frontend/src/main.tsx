import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './store/store.ts';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const TaskDashboard = lazy(() => import('./pages/TaskDashboard.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading page...</div>}>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<TaskDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
