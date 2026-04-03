import type { LabelHTMLAttributes } from "react";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ className = "", ...props }: Props) => {
  return (
    <label
      {...props}
      className={`
        block text-sm font-medium text-[rgb(var(--text))]
        ${className}
      `}
    />
  );
};

export default Label;