import Button from '../../navigation/Button';
import ButtonGroup from '../../navigation/ButtonGroup';
import NavigationButton from '../../navigation/NavigationButton';
import OrderSummary from '../../summary/OrderSummary';

export default function BudgetSummaryPage() {

  function generatePDF() {}

  return (<>
    <OrderSummary isBudget={true} />
    <ButtonGroup>
      <NavigationButton back label="CLIENTE" to="/presupuesto/cliente" arrowKey />
      <Button onClick={generatePDF}>IMPRIMIR</Button>
    </ButtonGroup>
  </>);
}