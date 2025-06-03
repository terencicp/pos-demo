import { Square, CheckSquare } from 'lucide-react';

/** Checkbox for toggling layaway order mode (do not ship products until fully paid)
 * 
 * @param {boolean} props.isLayaway - Whether layaway mode is enabled
 * @param {boolean} props.isFullyPaid - Whether the order is fully paid
 * @param {function} props.onLayawayChange - Save new isLayaway state to the order context
 */
export default function LayawayCheckbox({ isLayaway, isFullyPaid, onLayawayChange }) {

  if (isFullyPaid) {
    return null;
  }

  const CheckboxIcon = isLayaway ? CheckSquare : Square;

  return (
    <div className="cursor-pointer mt-6" onClick={() => onLayawayChange(!isLayaway)}>

      {/* Title */}
      <h3 className={`text-lg font-medium mb-1 ${isLayaway ? 'text-black' : 'text-gray-400'}`}>
        Pago a plazos
      </h3>

      <div className={`flex space-x-2 rounded-md py-1`}>

        {/* Checkbox */}
        <CheckboxIcon className={`h-5 w-5 flex-shrink-0 ${isLayaway ? 'text-blue-600' : 'text-gray-400'}`} />

        {/* Checkbox label */}
        <span className={`text-sm font-medium ${isLayaway ? 'text-black' : 'text-gray-400'}`}>
          No entregar hasta que no esté totalmente pagado
        </span>

      </div>
    </div>
  );
}