import { createContext } from 'react';

const NavigationContext = createContext({
  lastVisitedPagePerSection: {},
  resetlastVisitedPageOfSection: () => {},
});

export default NavigationContext;