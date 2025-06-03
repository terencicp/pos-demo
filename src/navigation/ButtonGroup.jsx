import React from 'react';

// Spreads buttons to the sides
export default function ButtonGroup({
  children,
  className = '',
  ...rest
}) {
  const buttons = React.Children.toArray(children);

  let justify = 'justify-between';
  if (buttons.length === 1) {
    const button = buttons[0];
    if (button.props.back) {
      justify = 'justify-start';
    } else if (button.props.forward) {
      justify = 'justify-end';
    }
  }

  const groupStyles = `flex items-center ${justify} gap-4 mb-4 ${className}`;

  return (
    <div className={groupStyles} {...rest}>
      {children}
    </div>
  );
}