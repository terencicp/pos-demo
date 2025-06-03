import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Chevron icon component
 * @param {boolean} props.left - If true, displays a left chevron
 * @param {boolean} props.right - If true, displays a right chevron
 * @param {boolean} props.double - If true, displays double chevrons
 * @param {number} props.size - Icon size
 * @param {number} props.strokeWidth - Icon stroke width
 * @param {string} props.className - Additional CSS classes
 */
export default function Chevron({
  left = false,
  right = false,
  double = false, // Add double prop
  size = 16,
  strokeWidth = 2.5,
  className = "inline-block align-text-top ml-1",
  ...props
}) {

  let ChevronIcon;
  if (left && !right) {
    ChevronIcon = double ? ChevronsLeft : ChevronLeft;
  } else {
    ChevronIcon = double ? ChevronsRight : ChevronRight;
  }

  return (
    <ChevronIcon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
