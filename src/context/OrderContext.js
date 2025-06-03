import { createContext } from "react";

import getOrderContextInitialState from './orderContextInitialState';

const OrderContext = createContext(getOrderContextInitialState());

export default OrderContext;