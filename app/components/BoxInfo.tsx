import { cn } from '@/utils/shadcn';

export const BoxInfo: IComponent<{
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
}> = ({ label, value, labelClassName, valueClassName }) => {
  return (
    <div className='flex flex-col gap-.5 items-center justify-center text-white font-semibold'>
      <span className={cn('text-xs opacity-40', labelClassName)}>{label}</span>
      <span className={cn('text-sm font-semibold', valueClassName)}>{value}</span>
    </div>
  );
};
