const getOrderContextInitialState = () => ({

  // Regular order
  products: [],
  client: {
    name: '',
    nif: '',
    address: '',
    postcode: '',
    city: '',
    phone: '',
    email: '',
    language: 'es', // default
    company: false // default
  },
  transactions: [],
  isLayaway: false,

  // Returns
  returnOrder: {},

  // Layaway payment
});

export default getOrderContextInitialState;