export const returnProductsScheme = {
  // TODO: Calculate these server-side
  products: [
    {
      id: '0',
      name: 'Samsung 75" QLED...',
      variations: 'Q80D, Warranty: 3 Year Extended',
      // Total items for this product in the original order
      originalQuantity: 1,
      // Items already returned in another order
      previousReturnedQuantity: 0,
      // Items in transit, cannot be returned
      lockedQuantity: 0,
      // Items the customer has not recieved yet, but not in transit
      unfulfilledUnlockedQuantity: 1,
      // Advance payment per item: Can be fully or partially paid
      // ((originalPrice - (fulfilledUnitPrice * fulfilledNotReturnedQuantity)) * ((paidTotal - fulfilledTotal) / total)) / (originalQuantity - fulfilledNotReturnedQuantity)
      unfulfilledUnitPrice: 0,
      // Items the customer has recieved - Items it has returned
      fulfilledNotReturnedQuantity: 0,
      // Fully paid price per item
      fulfilledUnitPrice: 0,
    }
  ]}

export const anaLopez = {
  documentNumber: 'R00002',
  products: [
    {
      id: '2',
      name: 'Nintendo Switch 2',
      variations: 'Mario Kart Bundle',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 1, // TODO: Delete if unnecessary !?
      unfulfilledUnitPrice: Math.round(45900 * 0.3),
      fulfilledNotReturnedQuantity: 0,
      fulfilledUnitPrice: 45900, 
    },
    {
      id: '6',
      name: 'Samsung Galaxy S25 Ultra',
      variations: '256GB, Titanium White',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 1,
      unfulfilledUnitPrice: Math.round(129900 * 0.3),
      fulfilledNotReturnedQuantity: 0,
      fulfilledUnitPrice: 129900,
    }
  ],
  transactions: [
    {
      "timestamp": 1747994400000,
      "method": "card",
      "type": "payment",
      "remainingAmount": 99540,
      "referenceNumber": "012884872452"
    }
  ],
  client: {
    name: 'Ana López García',
    nif: '',
    address: 'Calle Vilomer 123, Piso 2A',
    postcode: '08023',
    city: 'Barcelona',
    phone: '600112233',
    email: 'ana.lopez@example.com',
    language: 'es',
    countryCode: 'ES',
    company: false
  }
};

export const carlesBosch = {
  documentNumber: 'R00005',
  products: [
    {
      id: '1',
      name: 'iPhone 17 Pro Max',
      variations: '1TB',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 1,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(169900 * 0.3),
      fulfilledNotReturnedQuantity: 0,
      fulfilledUnitPrice: 169900,
    },
    {
      id: '5',
      name: 'Sony PlayStation 5 Pro',
      variations: 'Standard Edition, Premium Bundle',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 1,
      unfulfilledUnitPrice: Math.round(74900 * 0.3),
      fulfilledNotReturnedQuantity: 0,
      fulfilledUnitPrice: 74900,
    },
    {
      id: '9',
      name: 'Sony WH-1000XM5 Headphones',
      variations: 'Black',
      originalQuantity: 2,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(39900 * 0.3),
      fulfilledNotReturnedQuantity: 2,
      fulfilledUnitPrice: 39900,
    }
  ],
  transactions: [
    {
      "timestamp": 1748002800000,
      "method": "card",
      "type": "payment",
      "remainingAmount": 404850,
      "referenceNumber": "7648478003"
    }
  ],
  client: {
    name: 'Carles Bosch Vidal',
    nif: '72299823J',
    address: 'Passeig de Gràcia, 75, 4t 2a',
    postcode: '08008',
    city: 'Barcelona',
    phone: '622334455',
    email: 'carles.bosch@example.es',
    language: 'cat',
    countryCode: 'ES',
    company: false
  }
};

export const lauraCamps = {
  documentNumber: 'R00006',
  products: [
    {
      id: '2',
      name: 'Nintendo Switch 2',
      variations: 'Deluxe Bundle',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(54900 * 0.3),
      fulfilledNotReturnedQuantity: 1,
      fulfilledUnitPrice: 54900,
    },
    {
      id: '8',
      name: 'WD Black SN850X NVMe SSD',
      variations: '1TB, With Heatsink',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(14400 * 0.3),
      fulfilledNotReturnedQuantity: 1,
      fulfilledUnitPrice: 14400,
    }
  ],
  transactions: [
    {
      "timestamp": 1747485000000,
      "method": "cash",
      "type": "payment",
      "remainingAmount": 3760,
      "referenceNumber": "543453456"
    },
    {
      "timestamp": 1747485000001,
      "method": "card",
      "type": "payment",
      "remainingAmount": 276400,
      "referenceNumber": "3246532012"
    }
  ],
  client: {
    name: 'Laura Camps Serra',
    nif: '51123456E',
    address: 'Carrer del Rosselló, 220, Principal 1a',
    postcode: '08008',
    city: 'Barcelona',
    phone: '633445566',
    email: 'laura.camps@example.com',
    language: 'es',
    countryCode: 'ES',
    company: false
  }
};

export const elenaVila = {
  documentNumber: 'R00008',
  products: [
    {
      id: '1',
      name: 'iPhone 17 Pro Max',
      variations: '2TB',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 1,
      unfulfilledUnitPrice: 189900,
      fulfilledNotReturnedQuantity: 0,
      fulfilledUnitPrice: 189900,
    },
    {
      id: '4',
      name: 'Apple MacBook Pro 16"',
      variations: 'M4 Max 16-core, 128GB, 8TB SSD',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 1,
      unfulfilledUnitPrice: 899900,
      fulfilledNotReturnedQuantity: 0,
      fulfilledUnitPrice: 899900,
    }
  ],
  transactions: [
    {
      "timestamp": 1746951600000,
      "method": "financing",
      "type": "payment",
      "remainingAmount": 436200,
      "referenceNumber": "365765789"
    }
  ],
  client: {
    name: 'Pastisseria Vila S.L.',
    nif: 'B62013529',
    address: 'Gran Via de les Corts Catalanes, 600, Atic 1a',
    postcode: '08007',
    city: 'Barcelona',
    phone: '655667788',
    email: 'elena.vila@example.org',
    language: 'cat',
    countryCode: 'ES',
    company: true,
  }
};

export const sofiaNavarro = {
  documentNumber: 'R00009',
  products: [
    {
      id: '2',
      name: 'Nintendo Switch 2',
      variations: '64GB, Mario Kart Bundle',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(45900 * 0.3),
      fulfilledNotReturnedQuantity: 1,
      fulfilledUnitPrice: 45900,
    },
    {
      id: '10',
      name: 'iPad Air 11" M2',
      variations: '256GB',
      originalQuantity: 2,
      previousReturnedQuantity: 2,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(69900 * 0.3),
      fulfilledNotReturnedQuantity: 0,
      fulfilledUnitPrice: 69900,
    },
    {
      id: '11',
      name: 'Apple Watch Series 10',
      variations: '42mm, GPS',
      originalQuantity: 2,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(39900 * 0.3),
      fulfilledNotReturnedQuantity: 2,
      fulfilledUnitPrice: 39900,
    },
    {
      id: '6',
      name: 'Samsung Galaxy S25 Ultra',
      variations: '256GB, Titanium Black',
      originalQuantity: 1,
      previousReturnedQuantity: 0,
      lockedQuantity: 0,
      unfulfilledUnlockedQuantity: 0,
      unfulfilledUnitPrice: Math.round(129900 * 0.3),
      fulfilledNotReturnedQuantity: 1,
      fulfilledUnitPrice: 129900,
    }
  ],
  transactions: [
    {
      "timestamp": 1745575200000,
      "method": "card",
      "type": "payment",
      "remainingAmount": 123750,
      "referenceNumber": "35767675601"
    },
    {
      "timestamp": 1745575200001,
      "method": "financing",
      "type": "payment",
      "remainingAmount": 200000,
      "referenceNumber": "02367675603"
    }
  ],
  client: {
    name: 'Sofia Navarro Giménez',
    nif: '42828655X',
    address: 'Rambla de Catalunya, 50, Principal 2a',
    postcode: '08007',
    city: 'Badalona',
    phone: '677889900',
    email: 'sofia.navarro@example.com',
    language: 'es',
    countryCode: 'ES',
    company: false
  }
};
