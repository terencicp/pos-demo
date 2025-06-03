import { useState, useEffect, useRef } from 'react';

import Button from '../navigation/Button';

export default function QuantityModal({ product, onClose, onSetQuantity }) {

  const [quantity, setQuantity] = useState(product.quantity);

  const inputRef = useRef(null);

  // Focus the input when the modal opens
  useEffect(() => {
    inputRef.current.select();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    onSetQuantity(parseInt(quantity));
    onClose();
  }

  const handleModalKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e); 
    }
  };

  const variations = Object.values(product.selectedVariations || {}).filter(value => value).join(', ');

  return (
    <div className="py-6 px-8" onKeyDown={handleModalKeyDown} tabIndex={-1}>

      {/* Header */}
      <h2 className="text-xl font-bold mb-2">CANTIDAD</h2>
      <div className="text-sm mb-4">
        <div className="font-semibold">{product.name}</div>
        <div className="text-gray-700">{variations}</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-10 flex justify-center">

          {/* Quantity input */}
          <input
            ref={inputRef}
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            min="1"
            className="px-3 py-2 border-2 border-gray-300 rounded-md text-center text-xl hide-arrows max-w-20"
          />
        </div>
        
        {/* Buttons */}
        <div className="flex justify-center space-x-8 mb-1">
          <Button variant="secondary" onClick={onClose} className="px-4 py-3">
            CANCELAR
          </Button>
          <Button variant="primary" className="px-4 py-3" onClick={(e) => handleSubmit(e)}>
            APLICAR
          </Button>
        </div>
      </form>
    </div>
  );
}
