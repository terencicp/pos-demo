import { useState, useEffect, useContext } from 'react';

import OrderContext from '../context/OrderContext';
import getReturnableQuantity from './getReturnableQuantity';
import constrainReturnQuantities from './constrainReturnQuantities';
import ProductCheckbox from './ProductCheckbox';
import ProductRow from './ProductRow';
import { currencyEuro } from '../utils/currencyFormat';

// Table to enter returned item quantities and mark items as defective
export default function OrderReturnTable() {

  const { orderState, orderActions } = useContext(OrderContext);
  const products = orderState.returnOrder.products; 

  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  // Sync the "Select all" checkbox state with the products
  useEffect(() => {
    const selectableProducts = products.filter(p => getReturnableQuantity(p) > 0);
    if (selectableProducts.length === 0) {
      setIsSelectAllChecked(false);
    } else {
      setIsSelectAllChecked(selectableProducts.every(p => p.returnQuantity > 0));
    }
  }, [products]);

  function getDefaultInputQuantities(product, isSelected) {
    if (isSelected) {
      return {
        returnQuantity: getReturnableQuantity(product),
        inStoreQuantity: 0,
        pickupQuantity: product.fulfilledNotReturnedQuantity,
        defect: {}
      };
    } else {
      return { returnQuantity: 0, inStoreQuantity: 0, pickupQuantity: 0, defect: {} };
    }
  }

  function handleSelectAllProducts() {
    const updatedProducts = products.map(p => {
      if (getReturnableQuantity(p) === 0) return p;
      const newQuantities = getDefaultInputQuantities(p, !isSelectAllChecked);
      return { ...p, ...newQuantities, defect: {} };
    });
    orderActions.updateReturnProducts(updatedProducts);
  };

  function handleSelectProduct(productId) {
    const updatedProducts = products.map(p => {
      if (p.id != productId || getReturnableQuantity(p) === 0) return p;
      const newQuantities = getDefaultInputQuantities(p, !(p.returnQuantity > 0));
      return { ...p, ...newQuantities, defect: {} };
    });
    orderActions.updateReturnProducts(updatedProducts);
  };

  function handleInputQuantityChange(productId, inputName, inputValue) {
    const updatedProductsArray = products.map(p => {
      if (p.id != productId) return p;
      const inputQuantities = {
        returnQuantity: inputName === 'return' ? inputValue : p.returnQuantity,
        inStoreQuantity: inputName === 'in-store' ? inputValue : p.inStoreQuantity,
        pickupQuantity: inputName === 'pickup' ? inputValue : p.pickupQuantity,
      };
      let newInputQuantities = constrainReturnQuantities(p, inputQuantities, inputName);
      const { inStoreQuantity, pickupQuantity} = newInputQuantities;
      const defect = inStoreQuantity + pickupQuantity === 0 ? {} : p.defect;
      return { ...p, ...newInputQuantities, defect };
    });
    orderActions.updateReturnProducts(updatedProductsArray);
  };

  const handleColumnHeaderClick = (column) => {
    const updatedProductsArray = products.map(p => {
      if (p.returnQuantity === 0) return p; // Skip unselected products
      let inputQuantities = { // Set the clicked column to its maximum value
        returnQuantity: column === 'return' ? getReturnableQuantity(p) : p.returnQuantity,
        inStoreQuantity: column === 'in-store' ? p.fulfilledNotReturnedQuantity : p.inStoreQuantity,
        pickupQuantity: column === 'pickup' ? p.fulfilledNotReturnedQuantity : p.pickupQuantity,
      };
      const newInputQuantities = constrainReturnQuantities(p, inputQuantities, column);
      return { ...p, ...newInputQuantities };
    });
    orderActions.updateReturnProducts(updatedProductsArray);
  };

  const gridStyles = "grid grid-cols-[auto_1fr_5rem_5rem_5rem_5rem] items-center gap-x-4";
  const headerHoverStyles = "hover:text-blue-600 cursor-pointer";

  return (<>
    <div className="rounded border-2 border-gray-300 border-b-0 mt-8">

      {/* Table header */}
      <div className={`${gridStyles} p-4 bg-gray-100 border-b-2 border-gray-300 text-sm font-semibold`}>
        <ProductCheckbox selected={isSelectAllChecked} onClick={handleSelectAllProducts} />
        <div className={`${headerHoverStyles} py-1`} onClick={handleSelectAllProducts}>
          PRODUCTO
        </div>
        <div className={`${headerHoverStyles} text-center`} onClick={() => handleColumnHeaderClick('return')}>
          DEVOLVER
        </div>
        <div className={`${headerHoverStyles} text-center`} onClick={() => handleColumnHeaderClick('in-store')}>
          EN TIENDA
        </div>
        <div className={`${headerHoverStyles} text-center`} onClick={() => handleColumnHeaderClick('pickup')}>
          RECOGIDA
        </div>
        <div className="text-center">
          DEFECTO
        </div>
      </div>

      {/* Product rows */}
      {products.map(p => (
        <ProductRow
          key={p.id}
          product={p}
          onSelectProduct={handleSelectProduct}
          onInputQuantityChange={handleInputQuantityChange}
          gridStyles={gridStyles}
        />
      ))}
    </div>

    {/* Total */}
    {products.some(p => p.returnQuantity > 0) && (
      <div className="flex justify-end py-4 border-gray-300">
        <span className="font-semibold">TOTAL: {orderState.returnsTotal > 0 && '−'}{currencyEuro(orderState.returnsTotal)}</span>
      </div>
    )}
  </>);
}
