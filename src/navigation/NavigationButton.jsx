import React from 'react';
import Button from './Button';
import Chevron from './Chevron';

/**  NavigationButton used to navigate between pages
 * 
 * @param {boolean} props.back - If true, displays a left chevron
 * @param {boolean} props.forward - If true, displays a right chevron
 * @param {boolean} props.double - If true, displays double chevrons
 * @param {string} props.label - Button text
 * @param {string} props.to - URL to navigate to
 * @param {function} props.onClick - Click handler function
 * @param {boolean} props.arrowKey - If true, assigns an ID for keyboard navigation
 */
export default function NavigationButton({ 
  back, 
  forward, 
  double,
  label, 
  to, 
  onClick, 
  arrowKey,
  ...rest 
}) {

  const paddingClass = back ? 'pl-1 py-3' : 'pr-2 py-3';

  const buttonVariant = back ? 'secondary' : 'primary';

  const buttonId = arrowKey 
    ? (back ? 'navigate-back-button' : 'navigate-forward-button') 
    : undefined;

  return (
    <Button 
      id={buttonId}
      to={to} 
      onClick={onClick} 
      variant={buttonVariant} 
      className={paddingClass}
      {...rest}
    >
      {back && <Chevron left double={double} />}
      {label}
      {forward && <Chevron right double={double} />}
    </Button>
  );
}
