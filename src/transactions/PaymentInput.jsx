import { useState, useCallback, useMemo } from 'react';

import { currencyCommaToInt, currencyComma, isValidPrice } from '../utils/currencyFormat';
import { paymentMethods } from '../data/paymentMethods';
import InputButton from './InputButton';

const cash_limit = 100000;

/** Payment input form to select payment method, add amount and reference number
 * 
 * @param {string} props.inputAmount - Entered payment amount input value
 * @param {function} props.setInputAmount - Update the input amount
 * @param {number} props.pendingAmount - Remaining amount to be paid
 * @param {number} props.minimumDue - Minimum amount required to pay
 * @param {number} props.totalPaid - Total amount already paid
 * @param {number} props.totalCashPaid - Total amount paid in cash
 * @param {function} props.savePayment - Function to save payment to the order context
 * @param {boolean} props.isLayaway - Whether this is a layaway order
 */
export default function PaymentInput({ 
  inputAmount, 
  setInputAmount, 
  pendingAmount, 
  minimumDue, 
  totalPaid, 
  totalCashPaid, 
  savePayment, 
  isLayaway 
}) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errors, setErrors] = useState({ referenceNumber: false, amount: false, cashLimit: false });

  const isReferenceNumberRequired = useMemo(() => (
    selectedPaymentMethod === 'card' || selectedPaymentMethod === 'financing'
  ), [selectedPaymentMethod]);

  function clearErrors() {
    setErrors({ referenceNumber: false, amount: false, cashLimit: false });
  }

  function handleSelectPaymentMethod(method) {
    setSelectedPaymentMethod(method);
    clearErrors();
    if (method === 'cash') setReferenceNumber('');
  };

  function handleAmountInputChange(event) {
    const typedValue = event.target.value;
    if (!isValidPrice(typedValue)) {
      return; // Reject invalid characters
    }
    let numericValue = currencyCommaToInt(typedValue);
    let newInputAmount = typedValue;
    // Cash limit validation
    if (selectedPaymentMethod === 'cash' && numericValue > cash_limit) {
      newInputAmount = `${cash_limit / 100}`;
    // Order total limit validation
    } else if (numericValue > pendingAmount) {
      newInputAmount = currencyComma(pendingAmount);
    }
    setInputAmount(newInputAmount);
    clearErrors();
  };

  const handleMinButton = useCallback(() => {
    const remaining = Math.max(0, minimumDue - totalPaid);
    setInputAmount(currencyComma(remaining));
    clearErrors();
  }, [minimumDue, totalPaid, setInputAmount]);

  const handleMaxButton = useCallback(() => {
    const cappedAmount = selectedPaymentMethod === 'cash' ? Math.min(pendingAmount, cash_limit) : pendingAmount;
    setInputAmount(currencyComma(cappedAmount));
    clearErrors();
  }, [pendingAmount, setInputAmount, selectedPaymentMethod]);

  function handleReferenceNumberChange(event)  {
    setReferenceNumber(event.target.value);
    clearErrors();
  };

  const handleAddPayment = useCallback(() => {
    clearErrors();
    const inputAmountInt = currencyCommaToInt(inputAmount);
    if (inputAmount === '') {
      setErrors(prev => ({ ...prev, amount: true }));
      return;
    }
    const cashPaymentLimitExceeded = (totalCashPaid + inputAmountInt > cash_limit)
    if (selectedPaymentMethod === 'cash' && cashPaymentLimitExceeded) {
      setErrors(prev => ({ ...prev, cashLimit: true }));
      return;
    }
    if (isReferenceNumberRequired && !referenceNumber) {
      setErrors(prev => ({ ...prev, referenceNumber: true }));
      return;
    }
    savePayment({
      timestamp: Date.now(),
      method: selectedPaymentMethod,
      type: 'payment',
      amount: inputAmountInt,
      referenceNumber: referenceNumber
    });
    clearErrors();
    setReferenceNumber('');
  }, [inputAmount, referenceNumber, selectedPaymentMethod, savePayment, totalCashPaid, isReferenceNumberRequired]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddPayment();
    }
  }, [handleAddPayment]);

  const isMinButtonVisible = useMemo(() => (
    !isLayaway && // Not layaway
    minimumDue !== pendingAmount + totalPaid && // There's a minimum to pay
    totalPaid < minimumDue && // Paid is less than minimum
    !(selectedPaymentMethod === 'cash' && (minimumDue - totalPaid) > cash_limit) // Cash limit
  ), [isLayaway, minimumDue, pendingAmount, totalPaid, selectedPaymentMethod]);

  const inputLabelStyles = "block text-sm font-medium mb-1";
  function getInputStyles(hasError) {
    return `w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500 ${
      hasError ? 'border-red-500' : 'border-gray-400'
    }`;
  }

  return (<div className="mb-6">

    {/* Title */}
    <h3 className="text-lg font-medium mb-3">Añadir pago</h3>
    
    {/* Payment method buttons */}
    <div className="mb-3 flex space-x-2">
      {Object.keys(paymentMethods).map(method => {
        const isSelected = selectedPaymentMethod === method;
        const selectedStyles = isSelected
          ? 'border-blue-600 bg-gray-100 text-blue-600 bg-blue-100 hover:bg-blue-200'
          : 'border-transparent text-gray-700 bg-gray-100 hover:bg-gray-200';
        const PaymentMethodIcon = paymentMethods[method].icon;
        return (
          <button
            key={method}
            onClick={() => handleSelectPaymentMethod(method)}
            className={`py-2 px-3 border-2 rounded-md text-sm font-medium ${selectedStyles}
                      flex flex-1 items-center justify-center transition-all duration-200 cursor-pointer`}
          >
            <PaymentMethodIcon className={`w-[1.1rem] h-[1.1rem] mr-1 ${isSelected ? 'text-blue-600' : ''}`} />
            {paymentMethods[method].label}
          </button>
        );
      })}
    </div>

    <div className={`grid grid-cols-1 gap-x-4 mb-5
                   ${isReferenceNumberRequired ? 'grid-cols-[1fr_1fr_auto]' : 'grid-cols-[1fr_auto]'}`}>

      {/* Amount input */}
      <div>
        <label className={inputLabelStyles}>Importe:</label>
        <div className="relative">
          <input value={inputAmount} onChange={handleAmountInputChange} onKeyDown={handleKeyDown}
                 className={getInputStyles(errors.amount)} />
          <InputButton
            isDouble={isMinButtonVisible}
            secondaryText="MIN"
            onSecondaryClick={handleMinButton}
            text="MAX"
            onClick={handleMaxButton}
          />
        </div>
      </div>
        
      {/* Reference number */}
      {isReferenceNumberRequired && (
        <div>
          <label className={inputLabelStyles}>Referencia:</label>
          <input value={referenceNumber} onChange={handleReferenceNumberChange} onKeyDown={handleKeyDown}
                 className={getInputStyles(errors.referenceNumber)} />
        </div>
      )}
        
      {/* Add payment button */}
      <div className="self-end pb-[1px]">
        <button onClick={handleAddPayment}
                className="w-full bg-blue-800 hover:bg-blue-600 text-white py-2 px-4 rounded-md 
                           transition duration-150 flex items-center h-[2.65rem] cursor-pointer"
        >
          Añadir
        </button>
      </div>
    </div>

    {/* Cash limit error */}
    {errors.cashLimit && (
      <div className="text-center text-red-500 font-semibold text-sm mt-4 mb-3">
        El pago en efectivo no puede superar los 1000 €
      </div>
    )}
  </div>);
}