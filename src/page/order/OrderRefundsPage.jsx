import { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router'; 

import OrderContext from '../../context/OrderContext';
import NavigationButton from '../../navigation/NavigationButton';
import ButtonGroup from '../../navigation/ButtonGroup';
import Refunds from '../../transactions/Refunds'; 
import { currencyEuro } from '../../utils/currencyFormat.js';
import { OrderClientPageButton } from './OrderClientPage';
import { OrderSummaryPageButton } from './OrderSummaryPage';

// TODO: Items fully paid must be fully refunded
// Items partially paid must be partially refunded

export default function OrderRefundsPage() { 

  const { orderState } = useContext(OrderContext); 
  const { totalPrice, totalTransacted, transactions } = orderState;

  const [refundErrorMessage, setRefundErrorMessage] = useState(null); 

  const navigate = useNavigate();

  const totalToRefund = -totalPrice;
  const totalRefunded = -totalTransacted;

  const isRefundValid = useMemo(() => {
    if (transactions.length === 0) return true; // Allow summary peeking
    return totalRefunded === totalToRefund;
  }, [transactions, totalRefunded, totalToRefund]);

  const validationMessage = useMemo(() => {
    if (totalRefunded < totalToRefund) return `Hay ${currencyEuro(totalToRefund - totalRefunded)} pendientes de reembolso`;
    if (totalRefunded > totalToRefund) return "Los reembolsos no pueden exceder el total a reembolsar";
    return null;
  }, [totalRefunded, totalToRefund]);

  useEffect(function updateErrorMessage() {
    if (refundErrorMessage) { 
      if (isRefundValid) {
        setRefundErrorMessage(null); 
      } else {
        setRefundErrorMessage(validationMessage); 
      }
    }
  }, [isRefundValid, refundErrorMessage, validationMessage, setRefundErrorMessage]);

  function validateAndNextPage(nextPageURL) {
    if (isRefundValid) {
      navigate(nextPageURL);
    } else {
      setRefundErrorMessage(validationMessage);
    }
  }

  return (<>
    {orderState?.returnOrder?.products && // Prevent errors on page reload
      <Refunds refundValidationError={refundErrorMessage} />
    }
    <ButtonGroup>
      <OrderClientPageButton back />
      <OrderSummaryPageButton forward onClick={validateAndNextPage} />
    </ButtonGroup>
  </>);
}

export const URL = '/pedido/reembolsos';

export function OrderRefundsPageButton({ onClick, back = false, forward = false }) {
  return <NavigationButton label="REEMBOLSO" to={URL} onClick={onClick} back={back} forward={forward} arrowKey />;
}
