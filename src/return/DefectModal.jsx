import { useState } from 'react';

import QuantityInput from '../splitter/QuantityInput';
import Button from '../navigation/Button';

export default function DefectModal({ product, onClose, onSave, onCancel }) {

  const [defect, setDefect] = useState({
    inStoreQuantity: product.defect?.defectInStoreQuantity || 0,
    pickupQuantity: product.defect?.defectPickupQuantity || 0,
    comment: product.defect?.comment || '',
  });
  const [quantityError, setQuantityError] = useState(false);
  const [commentError, setCommentError] = useState(false);

  function handleSave() {
    const totalDefects = defect.inStoreQuantity + defect.pickupQuantity;
    if (totalDefects === 0) {
      setQuantityError(true);
      return;
    }
    if (defect.comment.trim() === '') {
      setCommentError(true);
      return;
    }
    onSave({
      defectInStoreQuantity: defect.inStoreQuantity,
      defectPickupQuantity: defect.pickupQuantity,
      comment: defect.comment
    });
  }

  return (
    <div className="py-6 px-8" onKeyDown={(e) => e.key === 'Escape' && onClose()}>

      {/* Modal title */}
      <h2 className="text-xl font-bold mb-4">UNIDADES DEFECTUOSAS</h2>

      {/* Product name and variations */}
      <div className="text-sm mb-4">
        <div className="font-semibold">{product.name}</div>
        <div className="text-gray-700">{product.variations}</div>
      </div>

      {/* Quantity inputs */}
      <div className="flex space-x-8 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">EN TIENDA</label>
          <QuantityInput
            value={defect.inStoreQuantity}
            max={product.inStoreQuantity}
            onChange={(value) => {
              setDefect(prevData => ({ ...prevData, inStoreQuantity: value }));
              setQuantityError(false);
            }}
            hasError={quantityError}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">RECOGIDA</label>
          <QuantityInput
            value={defect.pickupQuantity}
            max={product.pickupQuantity}
            onChange={(value) => {
              setDefect(prevData => ({ ...prevData, pickupQuantity: value }));
              setQuantityError(false);
            }}
            hasError={quantityError}
          />
        </div>
      </div>

      {/* Comments */}
      <label className="text-sm font-semibold">DESCRIPCIÓN</label>
      <textarea
        value={defect.comment}
        onChange={(e) => {
          setDefect(prevData => ({ ...prevData, comment: e.target.value }));
          setCommentError(false);
        }}
        className={`w-full h-20 p-2 border-2 rounded-md mb-4 text-sm
                   ${commentError ? 'border-red-500' : 'border-gray-300'}`}
      />

      {/* Buttons */}
      <div className="flex justify-center space-x-8 mb-1">
        <Button variant="secondary" onClick={onCancel} className="px-4 py-3">
          DESCARTAR
        </Button>
        <Button variant="primary" onClick={handleSave} className="px-4">
          GUARDAR
        </Button>
      </div>
    </div>
  );
}
