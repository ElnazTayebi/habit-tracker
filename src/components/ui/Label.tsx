import type { LabelHTMLAttributes } from "react";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ className = "", ...props }: Props) => {
    return (
        <label {...props}
            className={`
        block text-sm font-medium
        text-[rgb(var(--texzt))]
          ${className}
        `}
        />
    )
}
export default Label;