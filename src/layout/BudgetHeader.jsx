import Header from './Header';
import ResetBudgetAndOrderButton from '../context/ResetOrderButton';
import useArrowNavigation from '../navigation/useArrowNavigation.jsx'; // Add .jsx extension

import { Outlet } from 'react-router';

export default function BudgetHeader() {

  useArrowNavigation();

  return (<>
    <Header title="Presupuesto">
      <ResetBudgetAndOrderButton section="presupuesto" />
    </Header>
    <Outlet />
  </>);
}