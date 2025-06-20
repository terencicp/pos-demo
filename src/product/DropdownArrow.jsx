/**
 * @param {string} [props.className]
 */
const DropdownArrow = ({ className = "h-4 w-4" }) => {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  );
};

export default DropdownArrow;