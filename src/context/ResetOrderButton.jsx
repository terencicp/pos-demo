import { useContext } from 'react';
import { useNavigate } from 'react-router';

import Button from '../navigation/Button.jsx';
import { sectionDefaultPage } from '../routing/defaultPages.js';
import NavigationContext from '../routing/NavigationContext.js';
import OrderContext from './OrderContext.js';
import getOrderContextInitialState from './orderContextInitialState.js';

export default function ResetOrderButton({ section }) {
  
  const { resetlastVisitedPageOfSection } = useContext(NavigationContext);
  const { orderState, orderActions } = useContext(OrderContext);
  const navigate = useNavigate();
  
  // Hide button if already new order
  const initialClientState = getOrderContextInitialState().client;
  const isNewOrder =
    orderState.products.length === 0 &&
    JSON.stringify(orderState.client) === JSON.stringify(initialClientState) &&
    orderState.transactions.length === 0 &&
    orderState.isLayaway === false &&
    orderState.isReturnFlow === false;
  if (isNewOrder) {
    return null;
  }

  function resetOrder() {
    orderActions.resetState();
    // Delete last visited pages for both Budget and Order
    resetlastVisitedPageOfSection('presupuesto');
    resetlastVisitedPageOfSection('pedido');
    // Go to the start page of the current section
    navigate(sectionDefaultPage[section]);
  };

  return (
    <Button variant="secondary" rounded onClick={resetOrder}>+ NUEVO</Button>
  );
}