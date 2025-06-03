import { useMemo } from 'react';
import { currencyEuro } from '../utils/currencyFormat';

/** Progress bar with minimum, remaining, total and pending amount
 * 
 * @param {string} props.title - Title to display for the transaction section
 * @param {number} props.totalPrice - Total order price
 * @param {number} props.minimumDue - Minimum required to pay
 * @param {number} props.totalPaid - Sum of payments saved
 * @param {number} props.inputValue - Current payment amount being entered
 * @param {boolean} props.needsDelivery - Whether the order requires delivery
 * @param {Array} props.hasTransactions - True if there are transactions (payments or refunds)
 * @param {boolean} props.isLayaway - Whether this is a layaway order
 */
function TransactionProgressBar({
  title,
  totalPrice,
  minimumDue,
  totalPaid,
  inputValue,
  needsDelivery,
  hasTransactions,
  isLayaway
}) {
  const totalPaidWithInput = useMemo(() => totalPaid + inputValue, [totalPaid, inputValue]);
  const barPercent = useMemo(() => (totalPrice > 0 ? (totalPaidWithInput / totalPrice) * 100 : 0), [totalPaidWithInput, totalPrice]);
  const markerPercent = useMemo(() => (totalPrice > 0 ? (minimumDue / totalPrice) * 100 : 0), [minimumDue, totalPrice]);
  const remainingAmount = useMemo(() => Math.max(0, minimumDue - totalPaidWithInput), [minimumDue, totalPaidWithInput]);
  const pendingAmount = useMemo(() => totalPrice - totalPaidWithInput, [totalPrice, totalPaidWithInput]);
  const hasMinimumDue = useMemo(() => minimumDue !== totalPrice , [minimumDue, totalPrice]);

  const minDueMarkerStyle = { left: `${markerPercent}%` };
  const titleStyle = "text-lg font-semibold";
  const labelStyle = "text-sm font-medium";
  const valueStyle = "text-sm font-semibold ml-1";
  const progressBarColor = useMemo(() => {
    if (isLayaway) return 'bg-blue-700';
    else return totalPaidWithInput >= minimumDue ? 'bg-blue-700' : 'bg-gray-500';
  }, [isLayaway, totalPaidWithInput, minimumDue]);

  // TODO: Move payment title to progress bar

  return (
    <div className={`${hasMinimumDue || (!inputValue && !hasTransactions) ? 'mb-5' : ''}`}>

      {/* Top labels */}
      <div className="flex flex-col mb-2">
        <div className="flex items-end">
          <h2 className={titleStyle}>{title}</h2>
          {/* Total only */}
          {(!hasMinimumDue || isLayaway) && (
            <span className="ml-auto">
              <span className={labelStyle}>Total:</span>
              <span className={valueStyle}>{currencyEuro(totalPrice)}</span>
            </span>
          )}
        </div>
        {/* Minimum and Total */}
        {!isLayaway && hasMinimumDue && (
          <div className="flex mt-1">
            <span>
              <span className={labelStyle}>Mínimo:</span>
              <span className={valueStyle}>{currencyEuro(minimumDue)}</span>
            </span>
            <span className="ml-auto">
              <span className={labelStyle}>Total:</span>
              <span className={valueStyle}>{currencyEuro(totalPrice)}</span>
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-6 bg-gray-200 overflow-hidden rounded">
        <div className={`absolute top-0 bottom-0 transition-all duration-100 ${progressBarColor}`}
             style={{ width: `${barPercent}%` }}>
        </div>
        {!isLayaway && hasMinimumDue && (
          <div className="absolute top-0 bottom-0 w-[3px] bg-black" 
               style={minDueMarkerStyle}>
          </div>
        )}
      </div>

      {/* Bottom labels */}
      <div className="flex mt-1">
        {needsDelivery && !isLayaway && (hasTransactions || inputValue > 0) && (
          <div>
            <span className={labelStyle}>Restante:</span>
            <span className={valueStyle}>{currencyEuro(remainingAmount)}</span>
          </div>
        )}
        {(hasTransactions || inputValue > 0) && (
          <div className="ml-auto">
            <span className={labelStyle}>Pendiente:</span>
            <span className={valueStyle}> {currencyEuro(pendingAmount)} </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionProgressBar;