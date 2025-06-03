import { Trash2 } from 'lucide-react';

import { currencyEuro } from '../utils/currencyFormat';
import { paymentMethods } from '../data/paymentMethods';

/** List of transactions and buttons to delete them
 * 
 * @param {Array} props.transactions - Saved transactions (payments or refunds)
 * @param {function} props.onRemovePayment - Function to remove a transaction from the order context
 */
export default function TranasactionsList({ transactions, onRemoveTransaction }) {

  if (!transactions || transactions.length === 0) {
    return null;
  }
  
  return (
    <div className="my-6">

      {/* Title */}
      <h3 className="text-lg font-medium mb-2">
        Transacciones realizadas
      </h3>

      {transactions.map(transaction => {
        const PaymentTypeIcon = paymentMethods[transaction.method].icon;
        const hasReferenceNumber = transaction.method === 'card' || transaction.method === 'financing'
        return (
          // Transaction
          <div key={transaction.timestamp}
               className="mb-2 p-2 text-sm flex justify-between bg-gray-50 border-2 border-gray-200">
            <span className="flex items-center">
              <PaymentTypeIcon className="w-[1.1rem] h-[1.1rem] mr-[6px]" />
              {paymentMethods[transaction.method].label}{hasReferenceNumber && ` (${transaction.referenceNumber})`}: 
              {transaction.type === 'refund' ? ' −' : ' '}{currencyEuro(transaction.amount)}
              
            </span>
            {/* Delete transaction */}
            <button onClick={() => onRemoveTransaction(transaction.timestamp)}
                    className="p-1 rounded-full hover:bg-blue-100 transition-colors group cursor-pointer"
            >
            <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-blue-700 transition-colors" />
            </button>
          </div>
        );
      })}

    </div>
  );
}
