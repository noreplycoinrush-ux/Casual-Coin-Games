
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variantClasses = {
        primary: "bg-accent text-primary hover:bg-accent-dark focus:ring-accent",
        secondary: "bg-secondary text-light-text hover:bg-gray-600 focus:ring-gray-500",
        ghost: "bg-transparent text-accent hover:bg-secondary/50 focus:ring-accent",
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};
