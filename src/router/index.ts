import * as React from 'react';

const App = React.lazy(() => import('@/App'));
const Main = React.lazy(() => import('@/pages/Main'));
const TwoDMap = React.lazy(() => import('@/pages/2DMap'));

export const routes = [
  {
    path: '/',
    element: React.createElement(App),
    children: [
      {
        path: '/',
        element: React.createElement(Main),
      },
      {
        path: '/2d',
        element: React.createElement(TwoDMap),
      },
    ],
  },
];