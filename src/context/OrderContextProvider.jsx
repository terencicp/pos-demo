import { useReducer, useMemo } from 'react';

import getOrderContextInitialState from './orderContextInitialState';
import OrderContext from './OrderContext';
import calculateTransportCost from './calculateTransportCost';

const ActionTypes = {

  // Budget / Order header
  RESET: 'RESET', // New budget / order

  // Product page
  ADD_PRODUCT: 'ADD_PRODUCT', // Product selected
  UPDATE_PRODUCT_VARIATION: 'UPDATE_PRODUCT_VARIATION', // Variation selected
  UPDATE_PRODUCT_QUANTITY: 'UPDATE_PRODUCT_QUANTITY', // Quantity selected
  REMOVE_PRODUCT: 'REMOVE_PRODUCT', // Quantity set to 0
  ADD_PRODUCT_DISCOUNTED_PRICE: 'ADD_PRODUCT_DISCOUNTED_PRICE', // Discount applied
  DELETE_PRODUCT_DISCOUNTED_PRICE: 'DELETE_PRODUCT_DISCOUNTED_PRICE', // Remove discount

  // Collected / delivered products page
  UPDATE_PRODUCT_COLLECTED_QUANTITY: 'UPDATE_PRODUCT_COLLECTED_QUANTITY', // Top list

  // Client page
  UPDATE_CLIENT_FIELD: 'UPDATE_CLIENT_FIELD', // Input change

  // Transaction pages
  ADD_TRANSACTION: 'ADD_TRANSACTION', // Añadir
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION', // Trash
  SET_LAYAWAY: 'SET_LAYAWAY', // Pago a plazos

  // Summary pages
  UPDATE_COMMENT: 'UPDATE_COMMENT', // When typing

  // Return pages
  UPDATE_RETURN_PRODUCTS: 'UPDATE_RETURN_PRODUCTS', // Return table update
  UPDATE_TRANSPORT_PRODUCT: 'UPDATE_TRANSPORT_PRODUCT', // Calculate transportation cost

  // Document pages
  START_REFUND: 'START_REFUND',
};

function calculatePrice(product) {
  if (!product.variations) {
    return product.price * product.quantity;
  }
  const allVariationsSelected = Object.keys(product.variations).every(
    (variationKey) => product.selectedVariations[variationKey]
  );
  if (!allVariationsSelected) {
    return null;
  }
  let variationsPrice = 0;
  for (const variationKey in product.selectedVariations) {
    const selectedValue = product.selectedVariations[variationKey];
    const variationOptions = product.variations[variationKey];
    const selectedOption = variationOptions.find(opt => opt.value === selectedValue);
    variationsPrice += selectedOption.price;
  }
  return variationsPrice * product.quantity;
};

function orderReducer(state, action) {

  switch (action.type) {

    case ActionTypes.RESET:
      return getOrderContextInitialState();

    case ActionTypes.ADD_PRODUCT: {
      const newProduct = {
        ...action.payload,
        quantity: 1,
        selectedVariations: {}
      };
      newProduct.originalPrice = calculatePrice(newProduct);
      const updatedProducts = [...state.products, newProduct];
      return { ...state, products: updatedProducts };
    }
    
    case ActionTypes.UPDATE_PRODUCT_VARIATION: {
      const { key, variation, selectedValue } = action.payload;
      return {
        ...state,
        products: state.products.map(p => {
          if (p.key === key) {
            const updatedSelectedVariations = {
              ...p.selectedVariations,
              [variation]: selectedValue
            };
            const updatedProduct = {
              ...p,
              selectedVariations: updatedSelectedVariations,
              discountedPrice: undefined, // Remove discount
            };
            updatedProduct.originalPrice = calculatePrice(updatedProduct);
            return updatedProduct;
          }
          return p;
        }),
      };
    }

    case ActionTypes.UPDATE_PRODUCT_QUANTITY: {
      const { key, newQuantity } = action.payload;
      return {
        ...state,
        products: state.products.map(p => {
          if (p.key === key) {
            const prevQuantity = p.quantity;
            const currentCollectedQuantity = p.collectedQuantity ?? prevQuantity;
            let newCollectedQuantity;
            // Product quantity increases are always considered collected at the store
            if (newQuantity > prevQuantity) {
              newCollectedQuantity = currentCollectedQuantity + (newQuantity - prevQuantity);
            // Product quantity decreases are always removed from products to be delivered first
            } else if (newQuantity < prevQuantity) {
              const currentDeliveryQuantity = prevQuantity - currentCollectedQuantity;
              const decreaseAmount = prevQuantity - newQuantity;
              const decreaseFromDelivery = Math.min(decreaseAmount, currentDeliveryQuantity);
              const decreaseFromCollected = decreaseAmount - decreaseFromDelivery;
              newCollectedQuantity = currentCollectedQuantity - decreaseFromCollected;
            } else {
              newCollectedQuantity = currentCollectedQuantity;
            }
            return {
              ...p,
              quantity: newQuantity,
              collectedQuantity: newCollectedQuantity,
              originalPrice: calculatePrice({ ...p, quantity: newQuantity }),
              discountedPrice: undefined,
            };
          }
          return p;
        }),
      };
    }

    case ActionTypes.REMOVE_PRODUCT: {
      const { key } = action.payload;
      return {
        ...state,
        products: state.products.filter(p => p.key !== key)
      };
    }

    case ActionTypes.ADD_PRODUCT_DISCOUNTED_PRICE: {
        const { key, discountedPrice } = action.payload; 
        return {
            ...state,
            products: state.products.map(p => {
                if (p.key === key) {
                    // Validation: 0 <= maxDiscount <= 1
                    const maxDiscount = Math.min(Math.max(p.maxDiscount || 0, 0), 1); 
                    // Validation: minTotalDiscountedPrice <= totalDiscountedPrice <= totalOriginalPrice
                    const minDiscountedPrice = p.originalPrice * (1 - maxDiscount);
                    const validTotalDiscountedPrice = Math.min(
                        Math.max(minDiscountedPrice, discountedPrice), p.originalPrice
                    );
                    return {
                      ...p,
                      discountedPrice: validTotalDiscountedPrice, 
                    };
                }
                return p; // Not the target product
            }),
        };
    }

    case ActionTypes.DELETE_PRODUCT_DISCOUNTED_PRICE: {
        const { key } = action.payload;
        return {
            ...state,
            products: state.products.map(p => 
                p.key === key 
                    ? {
                        ...p,
                        discountedPrice: undefined,
                      }
                    : p
            ),
        };
    }

    case ActionTypes.UPDATE_PRODUCT_COLLECTED_QUANTITY: {
      const { key, newCollectedQuantity } = action.payload;
      return {
        ...state,
        products: state.products.map(p =>
          p.key === key
            ? { ...p, collectedQuantity: newCollectedQuantity }
            : p
        ),
      };
    }

    case ActionTypes.UPDATE_CLIENT_FIELD: {
      const { field, value } = action.payload;
      return {
        ...state,
        client: {
          ...state.client,
          [field]: value,
        },
      };
    }

    case ActionTypes.ADD_TRANSACTION: {
      const { method, type, amount } = action.payload;
      if (method === 'cash') { // Add to existing cash transaction
        const existingCash = state.transactions.find(t => t.method === 'cash' && t.type === type);
        if (existingCash) {
          return {
            ...state,
            transactions: state.transactions.map(t => 
              t.method === 'cash' && t.type === type ? { ...t, amount: t.amount + amount } : t
            )
          };
        }
      }
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    }

    case ActionTypes.REMOVE_TRANSACTION: {
      return {
        ...state,
        transactions: state.transactions.filter(p => p.timestamp !== action.payload),
      };
    }

    case ActionTypes.SET_LAYAWAY: {
      return {
        ...state,
        isLayaway: action.payload,
      };
    }

    case ActionTypes.UPDATE_COMMENT: {
      return {
        ...state,
        comment: action.payload,
      };
    }

    case ActionTypes.UPDATE_RETURN_PRODUCTS: {
      return {
        ...state,
        returnOrder: {
          ...state.returnOrder,
          products: action.payload.updatedProducts,
        },
      };
    }

    case ActionTypes.START_REFUND: { // TODO: Reset state before refund!
      return {
        ...getOrderContextInitialState(),
        returnOrder: action.payload,
        client: action.payload.client,
      };
    }

    case ActionTypes.UPDATE_TRANSPORT_PRODUCT: {
      const newTransportCost = calculateTransportCost(action.payload.needsPickup, state.client.city);
      const existingTransportProduct = state.products.find(p => p.id === '1');
      let productsWithoutTransport = state.products.filter(p => p.id !== '1');
      // Remove transport product if it exists
      if (!newTransportCost) {
        return { ...state, products: productsWithoutTransport };
      }
      // Add transport product preserving previous discount
      const transportProduct = {
        id: '1',
        key: Date.now(),
        name: 'Transporte',
        maxDiscount: 1,
        originalPrice: newTransportCost,
        isService: true,
        quantity: 1,
      };
      if (existingTransportProduct && typeof existingTransportProduct.discountedPrice === 'number') {
        const discountPercent = existingTransportProduct.discountedPrice / existingTransportProduct.originalPrice;
        transportProduct.discountedPrice = Math.round(newTransportCost * discountPercent);
      }
      const productsWithTransport = [transportProduct, ...productsWithoutTransport];
      return { ...state, products: productsWithTransport };
    }

    default:
      return state;
  }
}

export default function OrderContextProvider({ children }) {

  const [orderState, dispatch] = useReducer(orderReducer, getOrderContextInitialState());

  const orderActions = useMemo(() => ({

    resetState: () => 
      dispatch({ type: ActionTypes.RESET }),
    
    addProduct: (payload) => 
      dispatch({ type: ActionTypes.ADD_PRODUCT, payload }),
    
    updateProductQuantity: (key, newQuantity) => 
      dispatch({ 
        type: ActionTypes.UPDATE_PRODUCT_QUANTITY, 
        payload: { key, newQuantity } 
      }),
    
    removeProduct: (key) => 
      dispatch({ 
        type: ActionTypes.REMOVE_PRODUCT, 
        payload: { key } 
      }),
    
    updateProductVariation: (key, variation, selectedValue) => 
      dispatch({ 
        type: ActionTypes.UPDATE_PRODUCT_VARIATION, 
        payload: { key, variation, selectedValue } 
      }),
    
    addProductDiscountedPrice: (key, discountedPrice) => 
      dispatch({
        type: ActionTypes.ADD_PRODUCT_DISCOUNTED_PRICE,
        payload: { key, discountedPrice }
      }),
      
    deleteProductDiscountedPrice: (key) =>
      dispatch({
        type: ActionTypes.DELETE_PRODUCT_DISCOUNTED_PRICE,
        payload: { key }
      }),

    updateProductCollectedQuantity: (key, newCollectedQuantity) =>
      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_COLLECTED_QUANTITY,
        payload: { key, newCollectedQuantity },
      }),

    updateClientField: (field, value) =>
      dispatch({
        type: ActionTypes.UPDATE_CLIENT_FIELD,
        payload: { field, value },
      }),

    addTransaction: (transaction) =>
      dispatch({ type: ActionTypes.ADD_TRANSACTION, payload: transaction }),

    removeTransaction: (transactionTimestamp) =>
      dispatch({ type: ActionTypes.REMOVE_TRANSACTION, payload: transactionTimestamp }),

    setLayaway: (isLayaway) =>
      dispatch({ type: ActionTypes.SET_LAYAWAY, payload: isLayaway }),

    updateComment: (comment) =>
      dispatch({ type: ActionTypes.UPDATE_COMMENT, payload: comment }),

    updateReturnProducts: (updatedProducts) =>
      dispatch({
        type: ActionTypes.UPDATE_RETURN_PRODUCTS,
        payload: { updatedProducts },
      }),

    startRefund: (payload) =>
      dispatch({ type: ActionTypes.START_REFUND, payload }),

    updateTransportCost: (needsPickup) =>
      dispatch({ 
        type: ActionTypes.UPDATE_TRANSPORT_PRODUCT, 
        payload: { needsPickup }
      }),

  }), []);

  const salesTotal = useMemo(() => {
    return orderState.products.reduce((total, p) => {
      const productPrice = p.discountedPrice ?? p.originalPrice;
      return total + productPrice;
    }, 0);
  }, [orderState.products]);

  const returnsTotal = useMemo(() => {
    let total = 0;
    if (orderState.returnOrder && orderState.returnOrder.products) {
      total = orderState.returnOrder.products.reduce((sum, p) => {
        if (!p.returnQuantity) {
          return sum;
        }
        const physicalReturnQuantity = (p.inStoreQuantity ?? 0) + (p.pickupQuantity ?? 0);
        const cancelledQuantity = p.returnQuantity - physicalReturnQuantity;
        const productRefund = (cancelledQuantity * p.unfulfilledUnitPrice) + (p.inStoreQuantity * p.fulfilledUnitPrice);
        return sum + Math.round(productRefund);
      }, 0);
    }
    return total;
  }, [orderState.returnOrder]);

  const totalPrice = useMemo(() => {
    return salesTotal - returnsTotal; // Can be negative
  }, [salesTotal, returnsTotal]);

  const minimumDue = useMemo(() => { // Collected + 0.3 Delivered - Returned
    let collectedPriceSum = 0;
    let deliveryPriceSum = 0;
    orderState.products.forEach(p => {
      const totalProductPrice = p.discountedPrice ?? p.originalPrice;
      const pricePerItem = totalProductPrice / p.quantity;
      const collectedQuantity = p.collectedQuantity ?? p.quantity;
      const deliveryQuantity = p.quantity - collectedQuantity;
      collectedPriceSum += pricePerItem * collectedQuantity;
      deliveryPriceSum += pricePerItem * deliveryQuantity;
    });
    return Math.ceil(collectedPriceSum + (deliveryPriceSum * 0.3)) - returnsTotal;
  }, [orderState.products, returnsTotal]);

  const needsDelivery = useMemo(() => {
    return orderState.products.some(p => (p.collectedQuantity ?? p.quantity) < p.quantity);
  }, [orderState.products]);
  
  const isReturnFlow = useMemo(() => {
    return Object.keys(orderState.returnOrder).length > 0;
  }, [orderState.returnOrder]);

  const needsPickup = useMemo(() => {
    return isReturnFlow &&
      orderState.returnOrder?.products?.length > 0 &&
      orderState.returnOrder.products.some(p => p.pickupQuantity > 0);
  }, [isReturnFlow, orderState.returnOrder?.products]);

  const totalPaid = useMemo(() => {
    return orderState.transactions
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [orderState.transactions]);

  const totalRefunded = useMemo(() => {  // Will be negative
    return orderState.transactions
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [orderState.transactions]);

  const totalTransacted = useMemo(() => {  // Can be negative
    return totalPaid - totalRefunded;
  }, [totalPaid, totalRefunded]);

  const contextValue = useMemo(() => ({ 
    orderState: {
      ...orderState,
      isReturnFlow,
      salesTotal,
      returnsTotal,
      totalPrice,
      minimumDue,
      totalPaid,
      totalRefunded,
      totalTransacted,
      needsDelivery,
      needsPickup,
    }, 
    orderActions 
  }), [orderState, orderActions, isReturnFlow, salesTotal, returnsTotal, totalPrice, minimumDue, totalPaid, totalRefunded, totalTransacted, needsDelivery, needsPickup]);

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// TODO: Abstract responsibilities to classes
