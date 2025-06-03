import  { useContext } from 'react';

import OrderContext from '../../context/OrderContext';
import Splitter from '../../splitter/Splitter';
import ButtonGroup from '../../navigation/ButtonGroup';
import NavigationButton from '../../navigation/NavigationButton';
import { OrderProductsPageButton } from './OrderProductsPage';
import { OrderClientPageButton } from './OrderClientPage';

export default function OrderCollectedPage() {
  
  const { orderState, orderActions } = useContext(OrderContext);

  const splitterProducts = orderState.products
    .filter(p => !p.isService)
    .map(p => ({ ...p, topQuantity: p.collectedQuantity}) // Product quantity to split products by
  );

  return (<>
    <Splitter
      products={splitterProducts}
      topTitle="Entregados en tienda"
      bottomTitle="Se entregarán a domicilio"
      onTopQuantityChange={orderActions.updateProductCollectedQuantity} 
    />
    <ButtonGroup className='mt-6'>
      <OrderProductsPageButton back />
      <OrderClientPageButton forward />
    </ButtonGroup>
  </>);
}

export const URL = '/pedido/entrega';

export function OrderCollectedPageButton({ onClick, back = false, forward = false }) {
  return <NavigationButton label="ENTREGA" to={URL} onClick={onClick} back={back} forward={forward} arrowKey />;
}
