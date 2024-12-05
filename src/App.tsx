import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';
import Navigation from '@/layouts/Navigation';
import { useDispatch } from 'react-redux';
import { setTab } from '@/store/navigationSlice';

function App() {
  const dispatch = useDispatch();

  const handleOnChangeTab = (tab: 'dailyFish' | 'reanalysis') => {
    dispatch(setTab(tab));
  };

  return (
    <div id={'app'} className={'relative grid h-screen w-screen grid-cols-[60px,_1fr] grid-rows-[55px,_1fr] overflow-hidden'}>
      <Header />
      <Navigation onChangeTab={handleOnChangeTab} />
      <Outlet />
    </div>
  );
}

export default App;
