import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    icon?: LucideIcon;
}

const Input = ({ icon: Icon, className = "", ...props }: Props) => {
    return (
        <div className="relative w-full">
            {Icon && (
                <Icon size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" />
            )}
            <input
                {...props}
                className={`w-full px-3 py-2 
                ${Icon ? "pl-10" : ""} 
                ${className}
                `} />
        </div>
    );
}
export default Input;