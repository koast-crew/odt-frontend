import { Home, Map } from 'lucide-react';

function Navigation() {
  return (
    <div className={'box-border flex size-full flex-col border-t border-zinc-500 bg-slate-800'}>
      <a href={'/'} className={'box-border flex h-[65px] w-full flex-col items-center justify-center border-b border-zinc-500'}>
        <Home className={'text-zinc-100'} width={'20'} height={'20'} />
        <div className={'m-[2px] text-[12px] font-bold text-zinc-100'}>{'홈'}</div>
      </a>
      <a href={'/2d'} className={'box-border flex h-[65px] w-full flex-col items-center justify-center border-b border-zinc-500'}>
        <Map className={'text-zinc-100'} width={'20'} height={'20'} />
        <div className={'m-[2px] text-[12px] font-bold text-zinc-100'}>{'2D 지도'}</div>
      </a>
    </div>
  );
}

export default Navigation;
