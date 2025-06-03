import { useMemo, useCallback, useContext, useState } from 'react';

import OrderContext from '../context/OrderContext';
import TransactionProgressBar from './TransactionProgressBar';
import PaymentInput from './PaymentInput';
import TranasactionsList from './TransactionsList';
import LayawayCheckbox from './LayawayCheckbox';
import { currencyCommaToInt } from '../utils/currencyFormat';

/** Add payments to the order
 * 
 * @param {string} [props.paymentValidationError] - Error message set when validation fails
 */
export default function Payments({ paymentValidationError }) {
  
  const { orderState, orderActions } = useContext(OrderContext);
  const { totalPrice, minimumDue, transactions, isLayaway, needsDelivery, totalTransacted } = orderState;

  const [inputAmount, setInputAmount] = useState('');

  const inputAmountValue = useMemo(() => currencyCommaToInt(inputAmount), [inputAmount]);
  const pendingAmount = useMemo(() => totalPrice - totalTransacted, [totalPrice, totalTransacted]);
  const isFullyPaid = useMemo(() => pendingAmount <= 0, [pendingAmount]);
  const totalCashPaid = useMemo(() => {
    return transactions
      .filter(t => t.type === 'payment' && t.method === 'cash')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [transactions]);

  const handleAddPayment = useCallback((newPayment) => {
    orderActions.addTransaction(newPayment);
    setInputAmount('');
  }, [orderActions]);

  const handleRemovePayment = useCallback((paymentId) => {
    orderActions.removeTransaction(paymentId);
  }, [orderActions]);

  const handleLayawayChange = useCallback((newValue) => {
    orderActions.setLayaway(newValue);
  }, [orderActions]);

  return (
    <div className="pb-6">

      {/* Progress bar */}
      <TransactionProgressBar
        title="Pagos"
        totalPrice={totalPrice}
        minimumDue={minimumDue}
        totalPaid={totalTransacted}
        inputValue={inputAmountValue}
        needsDelivery={needsDelivery}
        hasTransactions={transactions.length > 0}
        isLayaway={isLayaway}
      />

      {/* Validation error */}
      {paymentValidationError && (
        <div className="text-center text-red-500 text-sm font-semibold mb-3">
          {paymentValidationError}
        </div>
      )}

      {/* Amount input */}
      {!isFullyPaid && (
        <PaymentInput
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          pendingAmount={pendingAmount}
          minimumDue={minimumDue}
          totalPaid={totalTransacted}
          totalCashPaid={totalCashPaid}
          savePayment={handleAddPayment}
          isLayaway={isLayaway}
        />
      )}

      {/* Payment list */}
      <TranasactionsList
        transactions={transactions}
        onRemoveTransaction={handleRemovePayment}
      />

      {/* Layaway checkmark */}
      <LayawayCheckbox
        isLayaway={isLayaway}
        isFullyPaid={isFullyPaid}
        onLayawayChange={handleLayawayChange}
      />
    </div>
  );
};

