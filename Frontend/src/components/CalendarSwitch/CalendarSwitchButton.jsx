import { twMerge } from 'tailwind-merge';

const CalendarSwitchButton = ({ className = '', children, ...props }) => {
  return (
    <div {...props} className={twMerge('border border-neutral-700 rounded-full w-full py-1 text-white dark:text-gray-200 text-center text-sm font-nunito', className)}>
      {children}
    </div>
  );
};

export default CalendarSwitchButton;
