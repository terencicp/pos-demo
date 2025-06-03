import { forwardRef } from 'react';

/**
 * @param {string} props.id - id + name
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Callback triggered on value change
 * @param {boolean} [props.hasError=false] - Error for styling
 * @param {string} [props.type='text'] - The type of input
 */
const TextInput = forwardRef(({ id, value, onChange, hasError = false, type = 'text' }, ref) => {

  const baseInputClasses = "w-full px-3 py-2 border-2 rounded-md text-sm border-gray-400";
  const focusClasses = "focus:outline-none focus:border-blue-800";
  const errorClasses = "border-red-500 text-red-800 focus:border-red-800";

  return (
    <div className="relative rounded-md">
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`${baseInputClasses} ${focusClasses} ${hasError ? errorClasses : ""}`}
        ref={ref} // Forward the ref here
      />
    </div>
  );
});

export default TextInput;