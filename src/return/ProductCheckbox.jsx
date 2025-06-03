import { CheckCircle2, Circle } from 'lucide-react';

export default function ProductCheckbox({ selected, disabled = false, onClick }) {
  if (disabled) return <div className="w-5" />;
  return (
    <div className="flex justify-center w-5">
      <button
        onClick={onClick}
        className={`p-1 rounded-full${!disabled ? ' hover:bg-gray-200 cursor-pointer' : ''}`}
      >
        {selected ? (
          <CheckCircle2 size={20} className="text-blue-600" />
        ) : (
          <Circle size={20} className="text-gray-400" />
        )}
      </button>
  </div>
  );
}