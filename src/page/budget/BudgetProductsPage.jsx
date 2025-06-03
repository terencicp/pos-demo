import { useContext } from 'react';
import { useNavigate } from 'react-router';

import ButtonGroup from '../../navigation/ButtonGroup';
import ProductSearch from '../../product/ProductSearch';
import ProductList from '../../product/ProductList';
import OrderContext from '../../context/OrderContext';
import useProductValidation from '../../product/useProductValidation';
import NavigationButton from '../../navigation/NavigationButton';

export default function BudgetProductsPage() {

  const { orderState: { products } } = useContext(OrderContext);
  const navigate = useNavigate();
  
  const { variationErrors, validate } = useProductValidation(products);

  function showErrorsOrNavigate() {
    if (validate()) {
      navigate('/presupuesto/cliente');
    }
  };

  const showClientButton = products.length > 0;

  return (<>
    <ProductSearch />
    <ProductList variationErrors={variationErrors} />
    {showClientButton && (
      <ButtonGroup className='mt-6'>
        <NavigationButton forward label="CLIENTE" onClick={showErrorsOrNavigate} arrowKey />
      </ButtonGroup>
    )}
  </>);
}