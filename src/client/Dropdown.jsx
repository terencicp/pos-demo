import { ChevronDown } from 'lucide-react';

/**
 * Dropdown (select) input field
 *
 * @param {string} props.id - id + name
 * @param {string} props.value - Current value
 * @param {function} props.onChange - Callback triggered on value change
 * @param {Array<object>} props.options - Array of options for the dropdown
 * @param {boolean} [props.hasError=false] - Error for styling
 * @param {string} [props.className] - Optional CSS
 */
export default function Dropdown({ id, value, onChange, options, hasError = false, className = '' }) {

  const baseSelectClasses = "w-full px-3 py-2 border-2 rounded-md text-sm appearance-none cursor-pointer";
  const focusClasses = "focus:outline-none focus:border-blue-800";
  const errorClasses = "border-red-500 text-red-900 focus:border-red-500"
  const defaultClasses = "border-gray-400";

  return (
    <div className="relative">

     {/* Select */}
      <select
        id={id}
        name={id} 
        value={value}
        onChange={onChange}
        className={`${baseSelectClasses} ${focusClasses} ${hasError ? errorClasses : defaultClasses} ${className}`}
        aria-invalid={hasError ? "true" : "false"}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Arrow down */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </div>
    </div>
  );
}