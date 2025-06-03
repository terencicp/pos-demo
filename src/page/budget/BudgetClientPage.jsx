import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { isValidPhoneNumber } from 'libphonenumber-js';
import * as validator from 'email-validator';

import ButtonGroup from '../../navigation/ButtonGroup';
import ClientForm from '../../client/ClientForm';
import NavigationButton from '../../navigation/NavigationButton';
import OrderContext from '../../context/OrderContext';

export default function BudgetClientPage() {

  const { orderState } = useContext(OrderContext);
  const [clientErrors, setClientErrors] = useState({});
  const navigate = useNavigate();

  const validateBudgetClient = useCallback(() => {
    const { client } = orderState;
    const errors = {};
    let isValid = true;
    // Validate optional fields
    if (client.phone?.trim() && !isValidPhoneNumber(client.phone.trim(), 'ES')) errors.phone = true;
    if (client.email?.trim() && !validator.validate(client.email.trim())) errors.email = true;
    // Check if any errors found
    if (Object.keys(errors).length > 0) {
      isValid = false;
    }
    setClientErrors(errors);
    return isValid;
    // eslint-disable-next-line
  }, [orderState.client]);

  // Validate on every key press after errors found
  useEffect(() => {
    if (Object.keys(clientErrors).length > 0) {
      validateBudgetClient();
    }
    // eslint-disable-next-line
  }, [orderState.client, validateBudgetClient]);

  function handleNavigateToSummary() {
    if (validateBudgetClient()) {
      navigate('/presupuesto/resumen');
    }
  }

  return (<>
    <ClientForm errors={clientErrors} />
    <ButtonGroup className="mt-6">
      <NavigationButton back label="PRODUCTOS" to="/presupuesto/productos" arrowKey />
      <NavigationButton forward label="RESUMEN" onClick={handleNavigateToSummary} arrowKey />
    </ButtonGroup>
  </>);
}