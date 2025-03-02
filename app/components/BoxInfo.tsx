export const BoxInfo: IComponent<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className='flex flex-col gap-.5 items-center justify-center text-white font-semibold'>
      <span className='text-xs opacity-40'>{label}</span>
      <span className='text-sm font-bold'>{value}</span>
    </div>
  );
};
