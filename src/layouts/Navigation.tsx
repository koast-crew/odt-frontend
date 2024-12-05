import { FishSymbol, Map } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface NavigationProps {
  onChangeTab: (tab: 'dailyFish' | 'reanalysis')=> void;
}

function Navigation({ onChangeTab }: NavigationProps) {
  const tab = useSelector((state: RootState) => state.navigation.tab);

  return (
    <div className={'box-border flex size-full flex-col border-t border-zinc-500 bg-slate-800'}>
      <a href={'/'} className={'box-border flex h-[65px] w-full flex-col items-center justify-center border-b border-zinc-500' + (tab === 'dailyFish' ? ' bg-blue text-light' : '')} onClick={() => onChangeTab('dailyFish')}>
        <FishSymbol className={'text-light'} width={'20'} height={'20'} />
        <div className={'m-[2px] text-[12px] font-bold text-light'}>{'어획량'}</div>
      </a>
      <a href={'/2d'} className={'box-border flex h-[65px] w-full flex-col items-center justify-center border-b border-zinc-500' + (tab === 'reanalysis' ? ' bg-blue text-light' : '')} onClick={() => onChangeTab('reanalysis')}>
        <Map className={'text-light'} width={'20'} height={'20'} />
        <div className={'m-[2px] text-[12px] font-bold text-light'}>{'2D 지도'}</div>
      </a>
    </div>
  );
}

export default Navigation;
