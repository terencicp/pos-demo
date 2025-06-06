import DropdownArrow from './DropdownArrow';

/**
 * @param {object} props.variations - Product variations
 * @param {object} props.selectedVariations - Currently selected variations
 * @param {object} [props.errors] - Optional, indicates unselected variations
 * @param {string} props.productKey - Unique product key to use in ids
 * @param {function} props.onVariationChange - Handler for variation changes
 */
const ProductVariations = ({ 
  variations, 
  selectedVariations = {}, 
  errors, 
  productKey, 
  onVariationChange 
}) => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-3">
      {Object.entries(variations).map(([variation, options]) => {
        const border = errors && errors[variation]
          ? 'border-red-500' // Error
          : 'border-gray-300'; // No error
        return (
          <div key={variation} className="flex flex-col relative">
            <label htmlFor={`${productKey}-${variation}`} className="text-sm capitalize mb-1">
              {variation}:
            </label>
            <select
              id={`${productKey}-${variation}`}
              value={selectedVariations[variation] || ""}
              onChange={(event) => onVariationChange(variation, event.target.value)}
              className={`p-2 pr-8 border-2 rounded-md text-sm min-w-[120px] appearance-none ${border} cursor-pointer`}
            >
              <option value="">-</option> {/* Default variation value */}
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.value}</option>
              ))}
            </select>
            <DropdownArrow />
          </div>
        );
      })}
    </div>
  );
};

export default ProductVariations;