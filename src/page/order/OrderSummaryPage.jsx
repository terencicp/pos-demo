import { useContext } from 'react';

import OrderContext from '../../context/OrderContext';
import NavigationButton from '../../navigation/NavigationButton';
import Button from '../../navigation/Button';
import ButtonGroup from '../../navigation/ButtonGroup';
import OrderSummary from '../../summary/OrderSummary';
import { OrderPaymentsPageButton } from './OrderPaymentsPage';
import { OrderRefundsPageButton } from './OrderRefundsPage';
import { OrderClientPageButton } from './OrderClientPage';

export default function OrderSummaryPage() {

  const { orderState } = useContext(OrderContext);
  const { totalPrice, products, returnOrder, minimumDue, totalTransacted, isLayaway } = orderState;

  const hasItems = products.length > 0 || returnOrder?.products?.some(p => p.returnQuantity > 0);
  let areTransactionsSufficient;
  if (minimumDue < 0) {
    areTransactionsSufficient = totalTransacted <= minimumDue;
  } else {
    areTransactionsSufficient = totalTransacted >= minimumDue;
  }
  const isLayawayPaid = isLayaway && totalTransacted > 0;
  const isOrderValid = hasItems && (areTransactionsSufficient || isLayawayPaid);

  return (<>
    <OrderSummary isBudget={false} />
    <ButtonGroup>
      {totalPrice > 0 ? (
        <OrderPaymentsPageButton back />
      ) : totalPrice < 0 ? (
        <OrderRefundsPageButton back />
      ) : (
        <OrderClientPageButton back />
      )}
      {isOrderValid && (
        <Button onClick={() => {}} className="px-2 py-3">
          GUARDAR
        </Button>
      )}
    </ButtonGroup>
  </>);
}

export const URL = '/pedido/resumen';

export function OrderSummaryPageButton({ onClick, back = false, forward = false }) {
  return <NavigationButton label="RESUMEN" to={URL} onClick={onClick} back={back} forward={forward} arrowKey />;
}
