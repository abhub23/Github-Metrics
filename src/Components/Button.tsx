interface Proptype {
  btnName: string;
  color: string;
  onClick: () => Promise<void> | void;
  border?: string;
}

const Button: React.FC<Proptype> = ({
  btnName,
  color,
  onClick,
  border,
}): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer transition-all ${color} font-mono text-xl w-26 h-12 text-white px-4 py-2 rounded-lg
        ${border} border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]`}
    >
      {btnName}
    </button>
  );
};

export default Button;
