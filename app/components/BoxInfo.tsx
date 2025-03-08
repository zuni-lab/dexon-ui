import { cn } from "@/utils/shadcn";

export const BoxInfo: IComponent<{
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
}> = ({ label, value, labelClassName, valueClassName }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-.5 font-semibold text-white">
      <span className={cn("text-xs opacity-40", labelClassName)}>{label}</span>
      <span className={cn("font-semibold text-sm", valueClassName)}>
        {value}
      </span>
    </div>
  );
};
