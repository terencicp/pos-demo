import { ArrowDown, ArrowUp } from 'lucide-react';
import QuantityInput from './QuantityInput';

function formatVariationString(selectedVariations) {
  if (!selectedVariations) {
    return null;
  }
  return Object.entries(selectedVariations)
    // Capitalize first letter of variation name, lowercase value
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.toLowerCase()}`)
    .join(' | ');
}

/**
 * Represents a single item within the Splitter component.
 *
 * @param {object} props.product - Product data ({ key, name, quantity, topQuantity, selectedVariations, ... }).
 * @param {boolean} props.isInTopList - Indicates if the item is in the top list.
 * @param {function} props.handleMoveProductToTop - Callback to move the entire quantity of this product to the top list.
 * @param {function} props.handleMoveProductToBottom - Callback to move the entire quantity of this product to the bottom list.
 * @param {function} props.handleTopQuantityChange - Callback when the top quantity changes.
 */
export default function SplitterItem({
  product,
  isInTopList,
  handleMoveProductToTop,
  handleMoveProductToBottom,
  handleTopQuantityChange,
}) {

  const { key: productKey, quantity } = product;
  const topQuantity = product.topQuantity ?? quantity;
  const variationString = formatVariationString(product.selectedVariations);
  const bottomQuantity = quantity - topQuantity;

  const arrowButtonStyle = "bg-blue-800 text-white hover:bg-blue-600 border-2 border-blue-800 " +
                          "inline-flex items-center justify-center rounded-md h-9 w-9 min-w-[36px]";
  const itemStyle = `flex items-center gap-4 p-3 border-2 rounded-md h-[69px] ${
    isInTopList ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-90'
  }`;

  return (
    <li className={itemStyle}>

      {/* Arrow button */}
      <button
        onClick={() => isInTopList ? handleMoveProductToBottom(productKey) : handleMoveProductToTop(productKey)}
        className={arrowButtonStyle}
      >
        {isInTopList
          ? <ArrowDown className="h-5 w-5" strokeWidth={2.5} />
          : <ArrowUp className="h-5 w-5" strokeWidth={2.5} />}
      </button>

      {/* Product name and variations */}
      <div className="flex-grow">
        <p className="font-medium">{product.name}</p>
        {variationString && (
          <p className="text-xs mt-1">{variationString}</p>
        )}
      </div>

      {/* Quantity input */}
      <div className="flex items-center justify-end w-14 h-9">
        {product.quantity > 1 && (
          <QuantityInput
            value={isInTopList ? topQuantity : bottomQuantity}
            max={product.quantity}
            onChange={(newValue) => {
              const newTopQuantity = isInTopList ? newValue : quantity - newValue;
              handleTopQuantityChange(productKey, newTopQuantity);
            }}
          />
        )}
      </div>
    </li>
  );
}
