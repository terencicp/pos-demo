import { useContext } from 'react';

import OrderContext from '../context/OrderContext';
import DocumentNumber from './DocumentNumber';
import { ClientSummary } from './ClientSummary';
import ProductSummary from './ProductSummary';
import { TransactionsSummary } from './TransactionsSummary';
import OrderComment from './OrderComment';

export default function OrderSummary({ isBudget = false }) {

  const section = isBudget ? "/presupuesto" : "/pedido";

  const { orderState, orderActions } = useContext(OrderContext);
  const { client, documentNumber, transactions, isLayaway, comment, totalPrice, totalTransacted } = orderState;

  return (
    <div className="pb-6 w-full">

      {/* Document number */}
      <DocumentNumber
        documentNumber={documentNumber}
      />

      {/* Client */}
      <ClientSummary
        section={section}
        client={client}
      />

      {/* Products */}
      <ProductSummary
        detailed={!isBudget}
        products={orderState.products}
        returnProducts={orderState.returnOrder.products}
        salesTotal={orderState.salesTotal}
        totalPrice={orderState.totalPrice}
        isLayaway={isLayaway}
      />

      {/* Payments */}
      {!isBudget && totalPrice !== 0 && (
        <TransactionsSummary
          transactions={transactions}
          totalPrice={totalPrice}
          totalTransacted={totalTransacted}
          isLayaway={isLayaway}
          section={section}
        />
      )}

      {/* Comments */}
      <OrderComment
        comment={comment}
        orderActions={orderActions}
      />
    </div>
  );
}