import { Archive, FileX, Store, Truck, ClipboardCheck } from 'lucide-react';

import { SummarySection } from './SummarySection';
import { SummaryIcon } from './SummaryIcon';
import { currencyEuro } from '../utils/currencyFormat';

/** List of products with a title and icon
 *
 * @param {Object[]} products
 * @param {string} title
 * @param {JSX.Element} icon - Lucide icon
 * @param {boolean} [spaced] - Whether to add top margin
 */
function ProductList({ products, title, icon, spaced }) {
  return (
    <>
      <div
        className={`flex items-center text-gray-800 text-lg font-semibold mb-1 ${
          spaced ? 'mt-3' : ''
        }`}
      >
        <SummaryIcon icon={icon} />
        <h2>{title}</h2>
      </div>
      <ul>
        {products.map((product) => (
          <ProductItem key={`${Math.random()}${product.key}`} product={product} />
        ))}
      </ul>
    </>
  );
}

/** Each product in the list
 *
 * @param {Object} props.product
 * @param {string} props.product.name
 * @param {number} props.product.quantity
 * @param {number} props.product.originalPrice
 * @param {number} [props.product.discountedPrice]
 */
function ProductItem({ product }) {

  const displayPrice = product.discountedPrice ?? product.originalPrice;
  
  return (
    <li className="py-0.75">
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="bg-gray-100 text-xs font-medium px-1.75 rounded-full">
            {product.quantity}
          </span>
          <p className="text-sm font-medium ml-2">{product.name}</p>
        </div>
        {product.originalPrice !== null && (
          <div>
            {typeof product.discountedPrice === 'number' && (
              <span className="text-sm text-gray-500 line-through font-mono mr-6">
                {currencyEuro(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-mono">
              {product.isRefund && ' −'}{currencyEuro(displayPrice)}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

/** Shows total price with a dividing line on top
 *
 * @param {number} props.amount - Total
 */
function TotalWithLine({ amount }) {
  return (
    <div className="flex justify-between text-sm font-semibold pt-2 mt-2 border-t border-gray-200">
      <span>Total:</span>
      <span className="font-mono">{currencyEuro(amount)}</span>
    </div>
  );
}

/** Displays a summary of products
 *
 * @param {Object[]} props.products
 * @param {Object[]} props.returnProducts
 * @param {boolean} props.detailed - Whether products are separated into multiple lists
 * @param {number} props.totalPrice - Total order price
 */
function ProductSummary({ detailed, products, returnProducts = [], totalPrice, salesTotal, isLayaway }) {

  if (!detailed) { // Single products list
    return (
      <SummarySection to="/presupuesto/productos" icon={Archive} title="Productos">
        <ul>
          {products.map((product) => (
            <ProductItem key={product.key} product={product} />
          ))}
        </ul>
        {products.length > 1 && <TotalWithLine amount={salesTotal} />}
      </SummarySection>
    );
  }

  if (detailed) { // Split products into multiple lists

    const productsCancelled = returnProducts
      .filter((product) => (product.returnQuantity ?? 0) - (product.inStoreQuantity ?? 0) - (product.pickupQuantity ?? 0) > 0)
      .map((product) => ({
        ...product,
        quantity: (product.returnQuantity ?? 0) - (product.inStoreQuantity ?? 0) - (product.pickupQuantity ?? 0),
        originalPrice: product.unfulfilledUnitPrice * (product.returnQuantity ?? 0) - (product.inStoreQuantity ?? 0) - (product.pickupQuantity ?? 0),
        isRefund: true
      }));

    const productsReturnedInStore = returnProducts
      .filter((product) => (product.inStoreQuantity ?? 0) > 0)
      .map((product) => ({
        ...product,
        quantity: product.inStoreQuantity,
        originalPrice: product.fulfilledUnitPrice * product.inStoreQuantity,
        isRefund: true
      }));

    let productsToPickup = returnProducts
      .filter((product) => (product.pickupQuantity ?? 0) > 0)
      .map((product) => ({
        ...product,
        quantity: product.pickupQuantity,
        originalPrice: null
      }));

    const calculatePriceForSales = (product, quantity) => {
      return {
        ...product,
        quantity,
        discountedPrice: product.discountedPrice
          ? (product.discountedPrice / product.quantity) * quantity
          : undefined,
        originalPrice: (product.originalPrice / product.quantity) * quantity,
      };
    };

    const physicalProducts = products.filter(p => !p.isService);

    const productsCollected = physicalProducts
      .filter((product) => (product.collectedQuantity ?? product.quantity) > 0)
      .map((product) =>
        calculatePriceForSales(product, product.collectedQuantity ?? product.quantity)
      );
    const productsToDeliver = physicalProducts
      .filter((product) => product.quantity > (product.collectedQuantity ?? product.quantity))
      .map((product) =>
        calculatePriceForSales(product, product.quantity - product.collectedQuantity)
      );

    const services = products.filter(p => p.isService);

    const isTotalVisible =
      products.length > 1 || (productsCollected.length > 0 && productsToDeliver.length > 0);

    return (
      
      <SummarySection to={returnProducts.length > 0 ? "/pedido/devolucion" : "/pedido/productos"}>

        {productsCancelled.length > 0 && (
          <ProductList
            products={productsCancelled}
            title="Productos cancelados"
            icon={FileX}
          />
        )}

        {productsReturnedInStore.length > 0 && (
          <ProductList
            products={productsReturnedInStore}
            title="Devueltos en tienda"
            icon={Store}
            spaced={productsCancelled.length > 0}
          />
        )}

        {productsToPickup.length > 0 && (
          <ProductList
            products={productsToPickup}
            title="Se recogerán a domicilio"
            icon={Truck}
            spaced={productsCancelled.length > 0 || productsReturnedInStore.length > 0}
          />
        )}

        {!isLayaway && productsCollected.length > 0 && (
          <ProductList
            products={productsCollected}
            title="Entregados en tienda"
            icon={Store}
            spaced={
              productsCancelled.length > 0 || productsReturnedInStore.length > 0 || productsToPickup.length > 0
            }
          />
        )}

        {!isLayaway && productsToDeliver.length > 0 && (
          <ProductList
            products={productsToDeliver}
            title="Se enviarán al cliente"
            icon={Truck}
            spaced={
              productsCancelled.length > 0 || productsReturnedInStore.length > 0 || productsToPickup.length > 0 || productsCollected.length > 0
            }
          />
        )}

        {services.length > 0 && (
          <ProductList
            products={services}
            title="Servicios"
            icon={ClipboardCheck}
            spaced={
              productsCancelled.length > 0 || productsReturnedInStore.length > 0 || productsToPickup.length > 0 || productsCollected.length > 0
            }
          />
        )}

        {isLayaway && (
          <ProductList
            products={products}
            title="Pendientes de pago"
            icon={Archive}
            spaced={
              services.length > 0 || productsCancelled.length > 0 || productsReturnedInStore.length > 0 || productsToPickup.length > 0
            }
          />
        )}

        {isTotalVisible && <TotalWithLine amount={totalPrice} />}

      </SummarySection>
    );
  }
}

export default ProductSummary;