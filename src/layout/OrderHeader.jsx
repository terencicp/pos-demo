import { useContext } from 'react';
import { Outlet } from 'react-router';

import Header from './Header';
import ResetBudgetAndOrderButton from '../context/ResetOrderButton';
import OrderContext from '../context/OrderContext';
import useArrowNavigation from '../navigation/useArrowNavigation.jsx'; // Add .jsx extension

export default function OrderHeader() {

  const { orderState } = useContext(OrderContext);

  const title = orderState.isReturnFlow ? "Devolución" : "Pedido";

  useArrowNavigation();

  return (<>
    <Header title={title}>
      <ResetBudgetAndOrderButton section="pedido" />
    </Header>
    <Outlet />
  </>);
}