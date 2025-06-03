import { useContext } from 'react';

import OrderContext from '../context/OrderContext';
import ProductItem from '../product/ProductItem';
import { currencyEuro } from '../utils/currencyFormat.js';

/** List of selected products in an order, with total price
 * 
 * @param {object} [props.variationErrors] - Indicates unselected variations
 */
export default function ProductList({ variationErrors = {} }) {

  const { orderState } = useContext(OrderContext);

  return (
    <div className="w-full mt-2">

      {/* Product list */}
      <div className="w-full">
        {orderState.products.map((product) => (
          <ProductItem
            key={product.key}
            product={product}
            variationErrors={variationErrors[product.key]}
          />
        ))}
      </div>

      {/* Total price (if more than 1 product) */}
      {orderState.products.length > 1 && (
        <>
          <div className="border-t-2 border-gray-300 mb-2"></div>
          <div className="pt-2 flex justify-end">
            <span className="font-semibold">
              TOTAL:&nbsp;&nbsp;{currencyEuro(orderState.salesTotal)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};