import { Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './router';
import { store } from './store';
import './index.css';
import './assets/font/font.css';
import Spinner from './components/Spinner';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Suspense fallback={<div className={'flex size-full items-center justify-center'}><Spinner /></div>}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </Suspense>,
  // </React.StrictMode>,
);
