import { useContext } from 'react';
import { useNavigate } from 'react-router';

import ButtonGroup from '../../navigation/ButtonGroup';
import ProductSearch from '../../product/ProductSearch';
import ProductList from '../../product/ProductList';
import OrderContext from '../../context/OrderContext';
import useProductValidation from '../../product/useProductValidation';
import NavigationButton from '../../navigation/NavigationButton';
import { OrderReturnPageButton } from './OrderReturnPage';
import { OrderCollectedPageButton } from './OrderCollectedPage';
import { OrderClientPageButton } from './OrderClientPage';

export default function OrderProductsPage() { 

  const { orderState } = useContext(OrderContext);
  const navigate = useNavigate();

  const { variationErrors, validate } = useProductValidation(orderState.products);

  function showErrorsOrNavigate() {
    if (validate()) {
      navigate('/pedido/entrega');
    }
  };

  const physicalProducts = orderState.products.filter(p => !p.isService);
  const areThereProducts = physicalProducts.length > 0;
  const isReturnOnly = orderState.isReturnFlow && physicalProducts.length === 0;
  const isLayaway = orderState.isLayaway;

  return (<>
    <ProductSearch />
    <ProductList variationErrors={variationErrors} />
    <ButtonGroup className='mt-6'>
      {orderState.isReturnFlow && (
        <OrderReturnPageButton back />
      )}
      {(areThereProducts && !isLayaway) && (
        <OrderCollectedPageButton forward onClick={showErrorsOrNavigate} />
      )}
      {(isLayaway || isReturnOnly) && (
        <OrderClientPageButton forward />
      )}
    </ButtonGroup>
  </>);
}

export const URL = '/pedido/productos';

export function OrderProductsPageButton({ onClick, back = false, forward = false }) {
  return <NavigationButton label="PRODUCTOS" to={URL} onClick={onClick} back={back} forward={forward} arrowKey />;
}
