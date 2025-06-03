import { useContext } from 'react';
import { useNavigate } from 'react-router';

import OrderContext from '../../context/OrderContext';
import {
  anaLopez,
  carlesBosch,
  lauraCamps,
  elenaVila,
  sofiaNavarro
} from './mockReturns';

export default function DocumentsPage() {

  const { orderActions } = useContext(OrderContext);

  const navigate = useNavigate();

  function handleStartRefund(order) {
    orderActions.startRefund(order);
    navigate('/pedido/devolucion');
  }

  return (
    <div>
      <div className="mb-4">
        <a onClick={() => handleStartRefund(anaLopez)} className="text-blue-800 hover:underline cursor-pointer">Devolución: Ana López</a>
      </div>
      <div className="mb-4">
        <a onClick={() => handleStartRefund(carlesBosch)} className="text-blue-800 hover:underline cursor-pointer">Devolución: Carles Bosch</a>
      </div>
      <div className="mb-4">
        <a onClick={() => handleStartRefund(lauraCamps)} className="text-blue-800 hover:underline cursor-pointer">Devolución: Laura Camps</a>
      </div>
      <div className="mb-4">
        <a onClick={() => handleStartRefund(elenaVila)} className="text-blue-800 hover:underline cursor-pointer">Devolución: Elena Vila</a>
      </div>
      <div className="mb-4">
        <a onClick={() => handleStartRefund(sofiaNavarro)} className="text-blue-800 hover:underline cursor-pointer">Devolución: Sofía Navarro</a>
      </div>
    </div>
  );
}