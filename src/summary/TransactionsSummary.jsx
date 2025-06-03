import { ReceiptEuro } from 'lucide-react';
import { SummarySection } from './SummarySection';
import { paymentMethods } from '../data/paymentMethods';
import { currencyEuro } from '../utils/currencyFormat';

// TODO: Separate into two lists, payments and refunds

export function TransactionsSummary({ transactions, totalPrice, totalTransacted, isLayaway, section }) {

  if (transactions.length === 0) {
    return (
      <SummarySection to={`${section}/pagos`} title="Transacciones" icon={ReceiptEuro}>
        <p className="text-gray-500 italic">Pendiente</p>
      </SummarySection>
    );
  }

  const isTotalVisible = transactions.length > 1 && Math.abs(totalPrice) > Math.abs(totalTransacted);

  return (
    <SummarySection to={`${section}/pagos`} title="Transacciones" icon={ReceiptEuro}>
      <div className="space-y-2 text-sm">

        {/* Payment list */}
        {transactions.map(t => {
          const PaymentMethodIcon = paymentMethods[t.method].icon;
          const hasReferenceNumber = t.method === 'card' || t.method === 'financing';
          return (
            <p key={t.timestamp} className="flex justify-between">
              <span className="flex items-center">
                <PaymentMethodIcon className="w-[1.1rem] h-[1.1rem] mr-[9px] ml-[2px]" />
                {paymentMethods[t.method].label} {hasReferenceNumber && `(${t.referenceNumber})`}
              </span>
              <span className="font-mono">{t.type === 'refund' && '−'}{currencyEuro(t.amount)}</span>
            </p>
          );
        })}

        {/* Total and pending */}
        {(isTotalVisible || totalPrice > totalTransacted) && <hr className="my-2 border-gray-300" />}
        {isTotalVisible && (
          <p className="flex justify-between text-sm font-semibold">
            Total:
            <span className="font-mono font-semibold">{currencyEuro(totalTransacted)}</span>
          </p>
        )}
        {totalPrice > totalTransacted && (
          <p className="flex justify-between text-sm text-gray-700">
            Pendiente:
            <span className="font-mono">{currencyEuro(Math.max(totalPrice - totalTransacted, 0))}</span>
          </p>
        )}
      </div>

      {/* Layaway warning */}
      {isLayaway && (
        <div className="text-sm bg-yellow-50 text-yellow-700 py-1 px-2 rounded-md mt-4" role="alert">
          <span className="font-bold">Pago a plazos: </span>
          <span >No se entregará ningún producto al cliente</span>
        </div>
      )}
    </SummarySection>
  );
}