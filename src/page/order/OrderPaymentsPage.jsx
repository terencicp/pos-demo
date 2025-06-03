import { useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 

import OrderContext from '../../context/OrderContext';
import NavigationButton from '../../navigation/NavigationButton';
import ButtonGroup from '../../navigation/ButtonGroup';
import Payments from '../../transactions/Payments';
import { currencyEuro } from '../../utils/currencyFormat.js';
import { OrderClientPageButton } from './OrderClientPage';
import { OrderSummaryPageButton } from './OrderSummaryPage';

export default function OrderPaymentsPage() {

  const [paymentErrorMessage, setPaymentErrorMessage] = useState(null);
  const { orderState, orderActions } = useContext(OrderContext);
  const { totalPrice, minimumDue, totalTransacted, isLayaway, transactions } = orderState;

  const navigate = useNavigate();

  const isPaymentValid = useMemo(() => {
    if (totalTransacted > totalPrice) {
      return false;
    }
    if (isLayaway) {
      return totalTransacted > 0;
    } else {
      return totalTransacted >= minimumDue;
    }
  }, [isLayaway, totalTransacted, minimumDue, totalPrice]);

  const validationMessage = useMemo(() => {
    if (totalTransacted > totalPrice) {
      console.log(totalTransacted, totalPrice);
      return "Los pagos no pueden exceder el importe total";
    }
    if (!isLayaway && totalTransacted < minimumDue) {
      return `Hay ${currencyEuro(Math.max(0, minimumDue - totalTransacted))} pendientes de pago`;
    }
    return null;
  }, [isLayaway, totalTransacted, minimumDue, totalPrice]);

  // Clear validation errors when conditions are met
  useEffect(() => {
    if (paymentErrorMessage) {
      if (isPaymentValid) {
        setPaymentErrorMessage(null);
      } else {
        setPaymentErrorMessage(validationMessage);
      }
    }
  }, [isPaymentValid, paymentErrorMessage, setPaymentErrorMessage, validationMessage]);

  function validateAndNextPage(nextPageURL) {
    if (isPaymentValid || transactions.length === 0) {
      if (totalTransacted === totalPrice) {
        orderActions.setLayaway(false);
      }
       navigate(nextPageURL);
    } else {
      setPaymentErrorMessage(validationMessage);
    }
  }

  return (<>
    <Payments paymentValidationError={paymentErrorMessage} />
    <ButtonGroup className="mt-2">
      <OrderClientPageButton back />
      <OrderSummaryPageButton forward onClick={validateAndNextPage} />
    </ButtonGroup>
  </>);
}

export const URL = '/pedido/pagos';

export function OrderPaymentsPageButton({ onClick, back = false, forward = false }) {
  return <NavigationButton label="PAGO" to={URL} onClick={onClick} back={back} forward={forward} arrowKey />;
}
