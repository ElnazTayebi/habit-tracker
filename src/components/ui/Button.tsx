import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    icon?: LucideIcon;
    children?: ReactNode;
}

const Button = ({
    variant = "primary",
    icon: Icon,
    className = "",
    children,
    disabled,
    ...props
}: Props) => {
    const base = "flex items-center justify-center gap-2 px-4 py-2 rounded-[var(--radius)] font-medium transition";

    const variants: Record<Variant, string> = {
        primary:
            "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:opacity-90",

        outline:
            "border border-[rgb(var(--text))] text-[rgb(var(--text))] hover:bg-[rgb(var(var(--card-muted)))]",

        ghost:
            "text-[rgb(var(--text))] hover:bg-[rgb(var(--card-muted))]",

        danger:
            "bg-[rgb(var(--danger))] text-white hover:opacity-90",
    };
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
            ${base}
            ${variants[variant]}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}>
            {Icon && <Icon size={18} />}
            {children}
        </button>
    )
}
export default Button;





