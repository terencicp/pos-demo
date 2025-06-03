import { useMemo, useCallback } from 'react';
import SplitterList from './SplitterList';

/** Splits products into top and bottom lists based on quantity.
 *
 * @param {Array<object>} props.products - Array of products ({ key, name, quantity, topQuantity, selectedVariations }). `topQuantity` represents the quantity in the top list.
 * @param {string} props.topTitle - Title for the top list.
 * @param {string} props.bottomTitle - Title for the bottom list.
 * @param {function} props.onTopQuantityChange - Callback function invoked when a product's top quantity changes. Passes (productKey, newTopQuantity).
 */
export default function Splitter({
  products = [],
  topTitle,
  bottomTitle,
  onTopQuantityChange,
}) {

  // Products on top and bottom lists for rendering
  const { topProducts, bottomProducts } = useMemo(() => {
    const topProducts = [];
    const bottomProducts = [];
    products.forEach(product => {
      const topQuantity = product.topQuantity ?? product.quantity;
      if (topQuantity > 0) {
        topProducts.push(product);
      }
      if (topQuantity < product.quantity) {
        bottomProducts.push(product);
      }
    });
    return { topProducts, bottomProducts };
  }, [products]);

  const handleMoveProductToTop = useCallback((productKey) => {
    const product = products.find(p => p.key === productKey);
    onTopQuantityChange(productKey, product.quantity);
  }, [products, onTopQuantityChange]);

  const handleMoveProductToBottom = useCallback((productKey) => {
    onTopQuantityChange(productKey, 0);
  }, [onTopQuantityChange]);

  const handleMoveAllProductsToTop = useCallback(() => {
    products.forEach(product => {
      onTopQuantityChange(product.key, product.quantity);
    });
  }, [products, onTopQuantityChange]);

  const handleMoveAllProductsToBottom = useCallback(() => {
    products.forEach(product => {
      onTopQuantityChange(product.key, 0);
    });
  }, [products, onTopQuantityChange]);

  const splitterItemProps = {
    handleMoveProductToTop,
    handleMoveProductToBottom,
    handleTopQuantityChange: onTopQuantityChange,
  };

  return (
    <div className="w-full space-y-6 pb-4">

      {/* Top list (Collected) */}
      <SplitterList
        title={topTitle}
        products={topProducts}
        isInTopList={true}
        emptyListProps={{ onMoveAll: handleMoveAllProductsToTop }}
        splitterItemProps={splitterItemProps}
      />

      {/* Bottom list (Pending) */}
      <SplitterList
        title={bottomTitle}
        products={bottomProducts}
        isInTopList={false}
        emptyListProps={{ onMoveAll: handleMoveAllProductsToBottom }}
        splitterItemProps={splitterItemProps}
      />
    </div>
  );
}
