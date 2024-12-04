export default function Spinner(props: { className?: string }) {
  const { className } = props;

  return (
    <div className={'flex items-center justify-center ' + className}>
      <div className={'loader'} />
    </div>
  );
}

