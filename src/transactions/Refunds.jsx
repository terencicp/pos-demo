import { useContext, useCallback, useState, useMemo } from 'react';
import OrderContext from '../context/OrderContext';
import TransactionProgressBar from './TransactionProgressBar';
import RefundInput from './RefundInput';
import TranasactionsList from './TransactionsList';

// TODO: Lock order (can't add new products) if credit card refunds are added !?

/** Add refunds to the order
 *
 * @param {string} [props.refundValidationError]
 */
export default function Refunds({ refundValidationError }) {

  const { orderState, orderActions } = useContext(OrderContext);
  const { transactions, totalPrice, totalTransacted } = orderState;
  const [refundInputsSum, setRefundInputsSum] = useState(0);

  const handleAddRefund = useCallback((newRefund) => {
    orderActions.addTransaction(newRefund);
    setRefundInputsSum(0);
  }, [orderActions]);

  const handleRemoveRefund = useCallback((transactionId) => {
    orderActions.removeTransaction(transactionId);
  }, [orderActions]);

  const pendingRefund = useMemo(() => {
    return Math.abs(totalPrice) - Math.abs(totalTransacted);
  }, [totalPrice, totalTransacted]);

  return (
    <div className="pb-6">
      <TransactionProgressBar
        title="Reembolsos"
        totalPrice={-totalPrice} // Refund value as positive
        minimumDue={-totalPrice}
        totalPaid={-totalTransacted} // Total refunded so far
        inputValue={refundInputsSum}
        hasTransactions={transactions.length > 0}
      />

      {refundValidationError && (
        <div className="text-center text-red-500 text-sm font-semibold mb-3">
          {refundValidationError}
        </div>
      )}

      <RefundInput 
        saveRefund={handleAddRefund} 
        onRefundsInputChange={setRefundInputsSum} 
        pendingRefund={pendingRefund}
      />

      <TranasactionsList 
        transactions={transactions} 
        onRemoveTransaction={handleRemoveRefund} 
      />
    </div>
  );
}
