import { forwardRef } from "react";

interface Proptype {
  btnName: string;
  color: string;
  onClick: () => Promise<void> | void;
  border?: string;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Proptype>(({
  btnName,
  color,
  onClick,
  border,
  disabled
}, ref): JSX.Element => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer transition-all ${color} font-mono lg:text-[20px] text-[14px] lg:w-[104px] w-[90px] lg:h-[48px] h-[38px] text-white px-auto py-2 rounded-lg
        ${border} border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]`}
    >
      {btnName}
    </button>
  )
}
)

export default Button;
