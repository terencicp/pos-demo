import { useContext } from 'react';
import { useNavigate } from 'react-router';

import OrderReturnTable from '../../return/OrderReturnTable';
import NavigationButton from '../../navigation/NavigationButton';
import ButtonGroup from '../../navigation/ButtonGroup';
import OrderContext from '../../context/OrderContext';
import { OrderProductsPageButton } from './OrderProductsPage';

export default function OrderReturnPage() {
  
  const { orderState, orderActions } = useContext(OrderContext);
  const navigate = useNavigate();
  const productsSelected = orderState?.returnOrder?.products?.some(p => p.returnQuantity > 0) ?? false;

  function handleNextPage(nextPageURL) {
    orderActions.updateTransportCost(orderState.needsPickup);
    navigate(nextPageURL);
  }

  return (<>
    {orderState?.returnOrder?.products && // Prevent errors on page reload
      <OrderReturnTable />
    }
    {productsSelected && (
      <ButtonGroup className='mt-6'>
        <OrderProductsPageButton forward onClick={handleNextPage} />
      </ButtonGroup>
    )}
  </>);
}

export const URL = '/pedido/devolucion';

export function OrderReturnPageButton({ onClick, back = false, forward = false }) {
  return <NavigationButton label="DEVOLUCIÓN" to={URL} onClick={onClick} back={back} forward={forward} arrowKey />;
}
