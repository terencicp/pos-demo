import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Input for adjusting quantity with up/down arrows, used in SplitterItem
 */
export default function QuantityInput({ value, max, onChange, hasError }) {

  const handleIncrement = () => onChange(Math.min(value + 1, max));
  const handleDecrement = () => onChange(Math.max(value - 1, 0));

  return (
    <div
      className={`relative flex items-center justify-end w-14 h-9 border-2 rounded-md bg-white
                 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
    >
      <div className="absolute left-0 top-0 bottom-0 flex flex-col w-5 bg-gray-100">
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-1/2 flex items-center justify-center hover:bg-blue-200 focus:bg-gray-200
                     cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          onClick={handleDecrement}
          disabled={value === 0}
          className="h-1/2 flex items-center justify-center hover:bg-blue-200 focus:bg-gray-200
                     cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <span className="text-sm font-medium pr-2">
        {value}
      </span>
    </div>
  );
}
