import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';
import Navigation from '@/layouts/Navigation';

function App() {
  return (
    <div id={'app'} className={'relative grid h-screen w-screen grid-cols-[60px,_1fr] grid-rows-[55px,_1fr] overflow-hidden'}>
      <Header />
      <Navigation />
      <Outlet />
    </div>
  );
}

export default App;
