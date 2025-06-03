import { useContext, useState, useEffect, useRef } from 'react';
import Slider from '@mui/material/Slider';

import OrderContext from '../context/OrderContext';
import Button from '../navigation/Button';
import { currencyComma, currencyCommaToInt, isValidPrice } from '../utils/currencyFormat.js';

const roundTo2Decimals = (value) => {
  return Math.round(value * 100) / 100;
};

/** Price discount modal content
 * 
 * @param {object} props.product - Product data from the context
 * @param {function} props.onClose - Function to close the modal
 */
export default function DiscountModal ({ product, onClose }) {

  const { orderActions } = useContext(OrderContext);

  const modalRef = useRef(null);

  const initialPrice = product.discountedPrice ?? product.originalPrice;
  const initialDiscount = ((product.originalPrice - initialPrice) / product.originalPrice) * 100
  const minDiscountedPrice = product.originalPrice * (1 - product.maxDiscount);

  const [sliderDiscountPercent, setSliderDiscountPercent] = useState(roundTo2Decimals(initialDiscount));
  const [rawInputValue, setRawInputValue] = useState(currencyComma(initialPrice));

  function handleSliderChange(_, newDiscountPercent) {
    setSliderDiscountPercent(newDiscountPercent);
    const newPrice = product.originalPrice * (1 - (newDiscountPercent / 100));
    const validNewPrice = Math.max(newPrice, minDiscountedPrice);
    setRawInputValue(currencyComma(validNewPrice));
  };
  
  function handleValidatePriceWhenInputLosesFocus() {
    let newDiscountedPrice = currencyCommaToInt(rawInputValue);
    // Validation: minDiscountedPrice <= newDiscountedPrice <= originalPrice
    const validNewDiscountedPrice = Math.min(
      Math.max(minDiscountedPrice, newDiscountedPrice), product.originalPrice
    );
    setRawInputValue(currencyComma(validNewDiscountedPrice));
    const newDiscountPercent = ((product.originalPrice - validNewDiscountedPrice) / product.originalPrice) * 100;
    setSliderDiscountPercent(roundTo2Decimals(newDiscountPercent));
  };

  const handleApplyDiscountAndClose = () => {
    if (sliderDiscountPercent === 0) {
      orderActions.deleteProductDiscountedPrice(product.key);
    } else {
      const newDiscountedPrice = currencyCommaToInt(rawInputValue);
      orderActions.addProductDiscountedPrice(product.key, newDiscountedPrice);
    }
    onClose();
  };

  function handleInputChange(event) {
    const inputValue = event.target.value;
    if (!isValidPrice(inputValue)) {
      return; // Reject invalid characters
    }
    setRawInputValue(inputValue);
  };
  
  function handleInputFocus(event) {
    event.target.select(); // Select input text when clicked
  };
  
  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.target.blur(); // Trigger validation
      event.stopPropagation();
      // Focus on the modal, allows a 2nd 'Enter' to confirm and close modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
  };

  const handleModalKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyDiscountAndClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  function calculateDynamicInputWidth(price) {
    return `${Math.max(3, price.length) * 0.7}em`;
  };

  const sliderLabels = () => {
    const maxDiscountPercent = product.maxDiscount * 100;
    const labels = [];
    // Show more labels if discount % is low
    const labelInterval = maxDiscountPercent <= 10 ? 2 : maxDiscountPercent <= 20 ? 5 : 10;
    for (let i = 0; i <= maxDiscountPercent; i += labelInterval) {
      labels.push(i);
    }
    return labels;
  };
  const sliderMarks = sliderLabels().map(value => ({ value, label: `${value}%` }));

  // Focus the modal when it mounts to allow keyboard navigation
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const variations = Object.values(product.selectedVariations || {}).filter(value => value).join(', ');

  return (
    <div className="py-6 px-8" onKeyDown={handleModalKeyDown} tabIndex={0} ref={modalRef}>

      {/* Header */}
      <h2 className="text-xl font-bold mb-2">DESCUENTO</h2>
      <div className="text-sm mb-10">
        <div className="font-semibold">{product.name}</div>
        <div className="text-gray-700">{variations}</div>
      </div>
      
      {product.maxDiscount === 0 ? (
        <div className="text-center mb-15 italic text-gray-500">
          No admite descuentos
        </div>
      ) : (
        <>
          {/* Slider */}
          <div className="mb-2 px-2">
            <Slider
              value={sliderDiscountPercent}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              step={1}
              marks={sliderMarks}
              min={0}
              max={product.maxDiscount * 100}
              sx={{color: '#233BB2'}} // Tailwind bg-blue-800
            />
          </div>
          
          {/* Price input */}
          <div className="text-center mb-13 flex justify-center items-center">
            <div className="inline-flex items-center">
              <input
                type="text"
                value={rawInputValue}
                onChange={handleInputChange}
                onBlur={handleValidatePriceWhenInputLosesFocus}
                onFocus={handleInputFocus}
                onKeyDown={handleInputKeyDown}
                className="text-xl font-bold border-b-2 border-gray-400 focus:outline-none hover:text-blue-800"
                style={{ 
                  width: calculateDynamicInputWidth(rawInputValue),
                  textAlign: 'center'
                }}
              />
              <span className="text-xl font-bold ml-1">€</span>
            </div>
          </div>
        </>
      )}
      
      {/* Buttons */}
      <div className="flex justify-center space-x-8 mb-1">
        <Button variant="secondary" onClick={onClose} className="px-4 py-3">
          CANCELAR
        </Button>
        <Button variant="primary" onClick={handleApplyDiscountAndClose} className="px-4">
          APLICAR
        </Button>
      </div>
    </div>
  );
};