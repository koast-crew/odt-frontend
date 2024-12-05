
function Header() {
  return (
    <div className={'z-50 col-span-3 grid size-full grid-cols-[55px,_180px,_1fr] bg-slate-800'}>
      <div className={'m-1'}>
        <img src={'/ci_koast.png'} className={'size-full'} />
      </div>
      <div className={'flex items-center justify-center text-[20px] font-bold text-light'}>{'한국해양기상기술'}</div>
    </div>
  );
}

export default Header;