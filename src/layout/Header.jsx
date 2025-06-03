import React from 'react';

/**
 * Header Component for all pages
 * Displays a title on the left and optional buttons on the right
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {ReactNode} props.children - Optional buttons or other elements to display on the right
 * @param {string} props.className - Additional classes (optional)
 */
export default function Header({ 
  title,
  children,
  className = '',
  ...rest 
}) {
  return (
    <header className={`flex justify-between items-center mb-6 h-8 ${className}`} {...rest}>
      <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
      {children && (
        <div className="flex items-center mt-2">
          {children}
        </div>
      )}
    </header>
  );
}