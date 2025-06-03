import { useContext, useState } from 'react';

import OrderContext from '../context/OrderContext';
import DropdownArrow from './DropdownArrow';
import ProductVariations from './ProductVariations';
import Modal from './Modal';
import DiscountModal from './DiscountModal';
import QuantityModal from './QuantityModal';
import { currencyEuro } from '../utils/currencyFormat.js';

/** Each product in a budget or order, with variations, quantity, price
 * 
 * @param {object} props.product - Product data from the context
 * @param {object} [props.errors] - Optional, indicates unselected variations
 */
export default function ProductItem({ product, variationErrors }) {

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const { orderActions } = useContext(OrderContext);

  const hasVariations = product.variations && Object.keys(product.variations).length > 0;
  const hasDiscount = product.discountedPrice !== undefined;
  const totalDiscountedPrice = hasDiscount ? product.discountedPrice : null;
  const isPriceClickable = product.originalPrice !== null;

  function handleVariationChange(variation, selectedValue) {
    orderActions.updateProductVariation(product.key, variation, selectedValue);
  }

  function handleQuantityChange(event) {
    const quantityValue = event.target.value;
    if (quantityValue === '+') {
      setIsQuantityModalOpen(true);
    } else {
      const quantity = parseInt(quantityValue);
      if (quantity === 0) {
        orderActions.removeProduct(product.key);
      } else {
        orderActions.updateProductQuantity(product.key, quantity);
      }
    }
  }

  function handleSetCustomQuantity(quantity) {
    if (quantity === 0) {
      orderActions.removeProduct(product.key);
    } else {
      orderActions.updateProductQuantity(product.key, quantity);
    }
  }

  function handlePriceClick() {
    if (isPriceClickable) {
      setIsDiscountModalOpen(true);
    }
  }

  return (
    <>
      <div className="flex items-center gap-x-4 py-4 border-b-2 border-gray-300 last:border-b-0">
        <div className="flex-grow min-w-[50%] space-y-3">

          {/* Prouct name */}
          <h3 className="font-medium">{product.name}</h3>

          {/* Product variations dropdown */}
          {hasVariations && (
            <ProductVariations 
              variations={product.variations}
              selectedVariations={product.selectedVariations}
              errors={variationErrors}
              productKey={product.key}
              onVariationChange={handleVariationChange}
            />
          )}
        </div>

        {/* Product quantity dropdown*/}
        {!product.isService && (
          <div className="flex flex-col flex-shrink-0 relative">
                <label htmlFor={`${product.key}-quantity`} className="text-sm mb-1">
                    Unidades:
                </label>
                <select
                  id={`${product.key}-quantity`}
                  value={product.quantity}
                  onChange={handleQuantityChange}
                  className="pl-3 p-2 border-2 border-gray-300 rounded-md text-sm 
                              w-[70px] appearance-none cursor-pointer"
                >
                  {/* Options: 0, 1-9, Custom quantity, + */}
                  <option value="0">0</option>
                  {[...Array(9).keys()].map(i => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                  {product.quantity > 9 && (
                    <option key={product.quantity} value={product.quantity}>
                      {product.quantity}
                    </option>
                  )}
                  <option value="+">+</option>
                </select>
                <DropdownArrow />
            </div>
        )}

        {/* Price */}
        <div 
          className={`flex flex-col min-w-[90px] text-right flex-shrink-0 
                    ${isPriceClickable ? 'cursor-pointer hover:text-blue-800' : ''}`}
          onClick={handlePriceClick}
          tabIndex={isPriceClickable ? 0 : -1}
          onKeyDown={(event) => {if (event.key === 'Enter') {handlePriceClick()}}}
        >
          {hasDiscount && product.originalPrice !== null ? (
            <>
              {/* Original + Discounted price */}
              <span className="text-gray-500 line-through mb-3"> {currencyEuro(product.originalPrice)}</span>
              <span className="font-medium"> {currencyEuro(totalDiscountedPrice)}</span>
            </>
          ) : (
            // Original price only (- if variations not selected)
            <span className="font-medium">
              {product.originalPrice !== null ? currencyEuro(product.originalPrice) : '-'}
            </span>
          )}
        </div>
      </div>

      {/* Discount Modal */}
      <Modal isOpen={isDiscountModalOpen}>
        <DiscountModal product={product} onClose={() => setIsDiscountModalOpen(false)} />
      </Modal>

      {/* Quantity Modal */}
      <Modal isOpen={isQuantityModalOpen} onClose={() => setIsQuantityModalOpen(false)}>
        <QuantityModal 
          product={product} 
          onClose={() => setIsQuantityModalOpen(false)} 
          onSetQuantity={handleSetCustomQuantity} 
        />
      </Modal>
    </>
  );
};