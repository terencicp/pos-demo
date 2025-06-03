import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { isValidNif, isValidLegalEntityNif } from 'nif-dni-nie-cif-validation';
import { isValidPhoneNumber } from 'libphonenumber-js';
import * as validator from 'email-validator';

import ClientForm from '../../client/ClientForm';
import ButtonGroup from '../../navigation/ButtonGroup';
import NavigationButton from '../../navigation/NavigationButton';
import OrderContext from '../../context/OrderContext';
import citiesData from '../../data/cities.json';
import { OrderProductsPageButton } from './OrderProductsPage';
import { OrderCollectedPageButton } from './OrderCollectedPage';
import { OrderPaymentsPageButton } from './OrderPaymentsPage';
import { OrderRefundsPageButton } from './OrderRefundsPage';
import { OrderSummaryPageButton } from './OrderSummaryPage';

const cities = citiesData.map(city => city.municipio);
const NIFthreshold = 300000; // 3000€

export default function OrderClientPage() {

  const navigate = useNavigate();

  const { orderState, orderActions } = useContext(OrderContext);
  const { client, totalPrice, needsDelivery, needsPickup, products } = orderState;

  const [clientErrors, setClientErrors] = useState({});
  const [infoMessage, setInfoMessage] = useState('');

  const validateOrderClient = useCallback(() => {
    const errors = {};
    let isValid = true;
    // Mandatory fields if transportation required
    if (needsDelivery || needsPickup) {
      if (!client.name.trim()) errors.name = true;
      if (!client.address.trim()) errors.address = true;
      if (!client.postcode.trim() || !errors.postcode && !/^\d{5}$/.test(client.postcode.trim())) errors.postcode = true;
      if (!client.city.trim() || !cities.includes(client.city.trim())) errors.city = true;
      if (!client.phone.trim() || !isValidPhoneNumber(client.phone.trim(), 'ES')) errors.phone = true;
    }
    // Mandatory fields if > 3000€
    if (totalPrice >= 300000) {
      if (!client.name.trim()) errors.name = true;
      if (!client.nif.trim() || !isValidNif(client.nif)) errors.nif = true;
      if (!client.address.trim()) errors.address = true;
      if (!client.postcode.trim() || !errors.postcode && !/^\d{5}$/.test(client.postcode.trim())) errors.postcode = true;
      if (!client.city.trim() || (!errors.city && !cities.includes(client.city.trim()))) errors.city = true;
    }
    // Validate optional fields
    if (client.nif.trim() && !isValidNif(client.nif)) errors.nif = true;
    if (client.phone.trim() && !errors.phone && !isValidPhoneNumber(client.phone.trim(), 'ES')) errors.phone = true;
    if (client.email.trim() && !validator.validate(client.email.trim())) errors.email = true;
    // Check if any errors found
    if (Object.keys(errors).length > 0) {
      isValid = false;
    }
    setClientErrors(errors);
    return isValid;
    // eslint-disable-next-line
  }, [orderState]);

  useEffect(function validateEveryKeyPressAfterErrors() {
    if (Object.keys(clientErrors).length > 0) {
      validateOrderClient();
    }
    // eslint-disable-next-line
  }, [client, validateOrderClient]);

  function validateAndNextPage(nextPageURL) {
    if (totalPrice >= NIFthreshold && (!client.nif.trim() || !client.address.trim())) {
      setInfoMessage("NIF y dirección obligatoria en pedidos superiores a 3000€");
    }
    if (validateOrderClient()) {
      if (isValidLegalEntityNif(client.nif)) {
        orderActions.updateClientField('company', true);
      } 
      orderActions.updateTransportCost(needsPickup);
      navigate(nextPageURL);
    }
  }

  const physicalProducts = products.filter(p => !p.isService);
  
  return (<>
    <ClientForm
      order={true}
      errors={clientErrors}
      cities={cities}
    />

    {infoMessage && <p className="text-red-600 text-sm text-center my-2">{infoMessage}</p>}

    <ButtonGroup className="mt-6">
      {(physicalProducts.length > 0 && !orderState.isLayaway) ? (
        <OrderCollectedPageButton back />
      ) : (
        <OrderProductsPageButton back />
      )}
      {totalPrice > 0 ? (
        <OrderPaymentsPageButton forward onClick={validateAndNextPage} />
      ) : totalPrice < 0 ? (
        <OrderRefundsPageButton forward onClick={validateAndNextPage} />
      ) : (
        <OrderSummaryPageButton forward onClick={validateAndNextPage} />
      )}
    </ButtonGroup>
  </>);
}

export const URL = '/pedido/cliente';

export function OrderClientPageButton({ onClick, back = false, forward = false }) {
  return <NavigationButton label="CLIENTE" to={URL} onClick={onClick} back={back} forward={forward} arrowKey />;
}
