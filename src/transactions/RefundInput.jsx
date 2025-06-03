import { useState, useMemo, useCallback, useContext, useEffect } from 'react';

import OrderContext from '../context/OrderContext';
import { currencyEuro } from '../utils/currencyFormat';
import { paymentMethods } from '../data/paymentMethods';
import { currencyCommaToInt, isValidPrice, currencyComma } from '../utils/currencyFormat';
import InputButton from './InputButton';

/** Shows original order payments to refund
 *
 * @param {function} saveRefund - Save refund to order context
 * @param {function} onRefundsInputChange - Notify parent of simulation amount changes for the ProgressBar
 * @param {number} pendingRefund - Order amount pending refund
 */
export default function RefundInput({ saveRefund, onRefundsInputChange, pendingRefund }) {

  const { orderState } = useContext(OrderContext);
  const { transactions, returnOrder } = orderState;
  const [error, setError] = useState(null);

  const originalPayments = useMemo(() => {
    return returnOrder.transactions.filter(t => t.type === 'payment');
  }, [returnOrder]);

  const [inputValues, saveInputValues] = useState({});

  useEffect(function sendInputsSumToParent() {
    const inputsSum = Object.values(inputValues).reduce((sum, value) => sum + currencyCommaToInt(value), 0);
    onRefundsInputChange(inputsSum);
    setError(null);
  }, [inputValues, onRefundsInputChange]);

  function constrainInputValue(payment, currentInputValues, currentPendingRefund, allTransactions) {
    // Constraint 1: Input value cannot exceed pending refund amount + other inputs
    const otherInputsSum = Object.entries(currentInputValues)
      .reduce((sum, [key, value]) => key !== payment.timestamp ? sum + currencyCommaToInt(value) : sum, 0);
    const refundRemainingForOrder = currentPendingRefund - otherInputsSum;
    // Constraint 2: Input value cannot exceed max refundable amount for this payment
    const alreadyRefundedForPayment = allTransactions
      .filter(t => t.originalTimestamp === payment.timestamp)
      .reduce((sum, refundObj) => sum + refundObj.amount, 0);
    const refundRemainingForPayment = payment.remainingAmount - alreadyRefundedForPayment;
    // Min of both constraints
    return Math.min(refundRemainingForPayment, refundRemainingForOrder);
  }

  const handleAmountChange = useCallback((payment, typedValue) => {
    if (!isValidPrice(typedValue)) return; // Reject invalid characters
    let numericValue = currencyCommaToInt(typedValue);
    let newRefundAmount = typedValue;
    const inputMax = constrainInputValue(payment, inputValues, pendingRefund, transactions);
    if (numericValue > inputMax) newRefundAmount = currencyComma(inputMax);
    saveInputValues(prev => ({ ...prev, [payment.timestamp]: newRefundAmount }));
  }, [inputValues, pendingRefund, transactions]);

  const handleMaxButtonClick = useCallback((payment) => {
    const inputMax = constrainInputValue(payment, inputValues, pendingRefund, transactions);
    saveInputValues(prev => ({ ...prev, [payment.timestamp]: currencyComma(inputMax) }));
  }, [transactions, pendingRefund, inputValues]);

  const handleAddRefund = useCallback((payment, fullAmount = null) => {
    const isFinancing = payment.method === 'financing';
    const inputAmount = currencyCommaToInt(inputValues[payment.timestamp] || '');
    let amountToAdd = isFinancing ? fullAmount : inputAmount;
    if (isFinancing) {
      const inputsSum = Object.entries(inputValues)
        .reduce((sum, [, value]) => sum + (currencyCommaToInt(value) || 0), 0);
      if (amountToAdd > (pendingRefund - inputsSum)) {
        setError("El importe de la financiación excede el importe pendiente de reembolsar");
        return;
      }
    }
    if (!inputValues[payment.timestamp]) { // Input is empty, then add max amount
        amountToAdd = constrainInputValue(payment, inputValues, pendingRefund, transactions);
    }
    saveRefund({
      timestamp: Date.now(),
      method: payment.method,
      type: 'refund',
      amount: amountToAdd,
      referenceNumber: payment.referenceNumber,
      originalTimestamp: payment.timestamp,
    });
    saveInputValues(prev => ({ ...prev, [payment.timestamp]: '' }));
  }, [inputValues, saveRefund, pendingRefund, transactions]);

  return (
    <div>

      {/* Title */}
      <h3 className="text-lg font-medium mb-3">Pagos originales</h3>

      {originalPayments.map(payment => {
        
        const PaymentMethodIcon = paymentMethods[payment.method]?.icon;
        
        // Remove fully refunded payments
        const alreadyRefunded = transactions
          .filter(t => t.originalTimestamp === payment.timestamp)
          .reduce((sum, t) => sum + t.amount, 0);
        const remainingPaymentRefund = payment.remainingAmount - alreadyRefunded;
        if (remainingPaymentRefund === 0) return null;

        // Financial booleans
        const inputsSum = Object.entries(inputValues)
          .reduce((sum, [, value]) => sum + (currencyCommaToInt(value) || 0), 0);
        const isFinanceButtonDisabled = remainingPaymentRefund > (pendingRefund - inputsSum);

        return (
          <div key={payment.timestamp} className="mb-4 p-3 border-2 border-gray-200 bg-gray-50">

            {/* Financing payments */}
            {payment.method === 'financing' && (
              // Payment method, amount remaining, reference number
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <PaymentMethodIcon className="w-[1.1rem] h-[1.1rem] mr-[10px]" />
                  <div>
                    <div className="text-sm font-medium">
                      {paymentMethods[payment.method]?.label}: {currencyEuro(payment.remainingAmount)}
                    </div>
                    <div className="text-sm text-black mt-1">
                      Referencia: {payment.referenceNumber}
                    </div>
                  </div>
                </div>
                {/* Add payment button */}
                <button
                  onClick={() => handleAddRefund(payment, remainingPaymentRefund)}
                  className={`bg-blue-800 text-white py-2 px-4 rounded-md transition duration-150 flex h-[2.65rem]
                           ${isFinanceButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer'}`}
                >
                  Añadir
                </button>
              </div>
            )}

            {/* Cash or Credit card payments */}
            {payment.method !== 'financing' && (<>
              {/* Payment method, amount remaining, reference number */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <PaymentMethodIcon className="w-[1.1rem] h-[1.1rem] mr-[6px]" />
                  <div className="text-sm font-medium">
                    {paymentMethods[payment.method]?.label}: {currencyEuro(payment.remainingAmount)}
                  </div>
                </div>
                <span className="text-sm text-black">
                  {payment.referenceNumber && `Referencia: ${payment.referenceNumber}`}
                </span>
              </div>
              {/* Input */}
              <div className="mt-2">
                <label className="block text-sm mb-1">
                  Reembolso:
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <input
                      value={inputValues[payment.timestamp] || ''}
                      onChange={(e) => handleAmountChange(payment, e.target.value)}
                      className="w-full px-3 py-2 border-2 rounded-md border-gray-400 bg-white"
                    />
                    <InputButton
                      text="MAX"
                      onClick={() => handleMaxButtonClick(payment)}
                    />
                  </div>
                  {/* Add payment button */}
                  <button
                    onClick={() => handleAddRefund(payment)}
                    className="bg-blue-800 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150
                                flex items-center h-[2.65rem] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={inputValues[payment.timestamp] === '0' || pendingRefund === 0}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </>)}

          </div>
        );
      })}

      {/* Error message */}
      {error && (
        <div className="text-center text-red-500 text-sm font-semibold mb-3 mt-6">
          {error}
        </div>
      )}

    </div>
  );
}
