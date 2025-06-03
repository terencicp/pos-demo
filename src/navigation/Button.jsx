import React from 'react';
import { Link } from 'react-router'; // This is correct

/**
 * @param {string} props.variant - Button variants: 'primary' (blue), 'secondary' (grey)
 * @param {boolean} props.rounded - Whether the button should have rounded corners (default: false)
 * @param {string} props.to - URL path for Link component (alternative to onClick)
 * @param {function} props.onClick - Click handler (alternative to to)
 */
const Button = ({ 
  variant = 'primary', 
  rounded = false,
  to, 
  onClick, 
  className = '',
  children,
  tabIndex = 0,
  ...rest
}) => {
  // Base styles for all buttons
  const baseStyles = 'px-3 py-2 font-medium text-sm rounded transition-colors focus:outline-none text-white ' + 
                     'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center cursor-pointer';
  
  // Variant specific styles
  const variantStyles = {
    primary: 'bg-blue-800 hover:bg-blue-600',
    secondary: 'bg-gray-600 hover:bg-gray-500'
  };
  const roundedStyles = rounded ? 'rounded-full px-3' : '';
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${roundedStyles} ${className}`;
  
  // If the onClick function is provided render a button, which has an onClick prop 
  if (onClick) {
    return (
      <button 
        className={buttonStyles}
        onClick={() => onClick(to)}
        tabIndex={tabIndex}
        {...rest}
      >
        {children}
      </button>
    );
  }
  
  // Otherwise render a Link component
  return (
    <Link 
      to={to} 
      className={buttonStyles} 
      tabIndex={tabIndex} 
      role="button"
      {...rest}
    >
      {children}
    </Link>
  );
};

export default Button;