import { AlertTriangle, Circle } from 'lucide-react';
import { useState, useContext } from 'react';

import ProductCheckbox from './ProductCheckbox';
import getReturnableQuantity from './getReturnableQuantity';
import ReturnQuantityInput from './ReturnQuantityInput';
import Modal from '../product/Modal';
import DefectModal from './DefectModal';
import OrderContext from '../context/OrderContext';

export default function ProductRow({ 
  product, 
  onSelectProduct, 
  onInputQuantityChange, 
  gridStyles
}) {

  const { orderState, orderActions } = useContext(OrderContext);
  const products = orderState.returnOrder.products;
  
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);

  function handleSaveDefect(defect) {
    const updatedProductsArray = products.map(p =>
      p.id === product.id ? { ...p, defect } : p
    );
    orderActions.updateReturnProducts(updatedProductsArray);
    setIsDefectModalOpen(false);
  }

  function handleCancelDefect() {
    const updatedProductsArray = products.map(p =>
      p.id === product.id ? { ...p, defect: {} } : p
    );
    orderActions.updateReturnProducts(updatedProductsArray);
    setIsDefectModalOpen(false);
  }

  const returnableQuantity = getReturnableQuantity(product);
  const isSelected = product.returnQuantity > 0;
  const disabled = returnableQuantity === 0;
  const hasPhysicalReturns = isSelected && product.inStoreQuantity + product.pickupQuantity > 0;
  const hasDefect = product.defect?.defectInStoreQuantity > 0 || product.defect?.defectPickupQuantity > 0;

  return (
    <>
      <div 
        className={`${gridStyles} px-4 py-3 border-b-2 border-gray-300 ${isSelected ? 'bg-blue-50' : ''} min-h-18
          ${disabled ? 'opacity-50 border-gray-400 hover:opacity-100 hover:border-gray-300 transition-all duration-900' : ''}`}
      >
        <ProductCheckbox 
          selected={isSelected} 
          disabled={disabled} 
          onClick={() => onSelectProduct(product.id)} 
        />

        {/* Product description */}
        <div 
          className={`text-sm ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`} 
          onClick={() => !disabled && onSelectProduct(product.id)}
        >
          <div className="font-semibold">{product.name}</div>
          <div className="text-gray-700">{product.variations}</div>
          <div className="text-gray-700 mt-1">{/* Quantities */}
            Pedido: {product.originalQuantity}
            {!(product.originalQuantity === product.previousReturnedQuantity) && `, Cliente tiene: ${product.fulfilledNotReturnedQuantity}`}
            {product.previousReturnedQuantity > 0 && `, Devuelto: ${product.previousReturnedQuantity}`}
            {product.lockedQuantity > 0 && `, Bloqueado: ${product.lockedQuantity}`}
          </div>
        </div>

        {/* DEVOLVER - Quantity Input */}
        <ReturnQuantityInput
          isVisible={isSelected}
          value={product.returnQuantity}
          max={returnableQuantity}
          onChange={(value) => onInputQuantityChange(product.id, 'return', value)}
        />

        {/* EN TIENDA - Quantity Input */}
        <ReturnQuantityInput
          isVisible={isSelected && product.fulfilledNotReturnedQuantity > 0}
          value={product.inStoreQuantity}
          max={Math.min(product.returnQuantity, product.fulfilledNotReturnedQuantity)}
          onChange={(value) => onInputQuantityChange(product.id, 'in-store', value)}
        />

        {/* RECOGIDA - Quantity Input */}
        <ReturnQuantityInput
          isVisible={isSelected && product.fulfilledNotReturnedQuantity > 0}
          value={product.pickupQuantity}
          max={Math.min(product.returnQuantity, product.fulfilledNotReturnedQuantity)}
          onChange={(value) => onInputQuantityChange(product.id, 'pickup', value)}
        />

        {/* DEFECTO - Checkbox */}
        <div className="flex justify-center">
          {hasPhysicalReturns && (
            <button
              onClick={() => setIsDefectModalOpen(true)}
              className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
            >
              {hasDefect
                ? <AlertTriangle size={20} className="text-orange-600" />
                : <Circle size={20} className="text-gray-400" />}
            </button>
          )}
        </div>
      </div>

      {/* Defect Modal */}
      <Modal isOpen={isDefectModalOpen} onClose={() => setIsDefectModalOpen(false)}>
        <DefectModal 
          product={product} 
          onClose={() => setIsDefectModalOpen(false)} 
          onSave={handleSaveDefect} 
          onCancel={handleCancelDefect} 
        />
      </Modal>
    </>
  );
}
