import React from "react";

type ButtonAs = "button" | "a" | "label";

export type ButtonProps = {
  as?: ButtonAs;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: boolean;
  theme?: "light" | "dark";
} & React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.LabelHTMLAttributes<HTMLLabelElement>;

const Button = React.forwardRef<any, ButtonProps>(({
  as: Component = "button",
  children,
  variant = "primary",
  size = "md",
  theme = "dark",
  className = "",
  icon = false,
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-bold tracking-[0.2em] uppercase rounded-2xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5C5C5] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center whitespace-nowrap";
  
  const darkVariantClasses = {
    primary: "bg-white text-black hover:bg-[#C5C5C5] shadow-lg shadow-white/5",
    secondary: "bg-white/5 border border-white/10 text-[#C5C5C5] hover:bg-[#C5C5C5] hover:text-black",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/10",
    danger: "bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30",
    ghost: "bg-transparent hover:bg-white/10 text-gray-400 hover:text-white border border-transparent",
  };

  const lightVariantClasses = {
    primary: "bg-[#1A1A1A] text-white hover:bg-black shadow-lg shadow-black/5",
    secondary: "bg-black/5 border border-black/10 text-gray-700 hover:bg-black/10 hover:text-black",
    outline: "bg-transparent border border-black/20 text-black hover:bg-black/5",
    danger: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100",
    ghost: "bg-transparent hover:bg-black/5 text-gray-500 hover:text-black border border-transparent",
  };
  
  const variantClasses = theme === "light" ? lightVariantClasses : darkVariantClasses;
  
  const sizeClasses = {
    xs: icon ? "w-8 h-8 p-0 text-sm rounded-xl" : "text-[9px] px-3 py-1.5 rounded-xl",
    sm: icon ? "w-10 h-10 p-0 text-base" : "text-[10px] px-4 py-2",
    md: icon ? "w-12 h-12 p-0 text-lg" : "text-xs px-6 py-3",
    lg: icon ? "w-14 h-14 p-0 text-xl" : "text-xs px-8 py-4",
  };

  return (
    <Component
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";
export default Button;