// TODO: Use actual data
const products = [
  {
    id: '17',
    name: 'iPhone 17 Pro Max',
    maxDiscount: 0.1,
    variations: {
      almacenamiento: [
        { value: '128GB', price: 119900 },
        { value: '256GB', price: 129900 },
        { value: '512GB', price: 149900 },
        { value: '1TB', price: 169900 },
        { value: '2TB', price: 189900 },
      ],
    }
  },
  {
    id: '2',
    name: 'Nintendo Switch 2',
    maxDiscount: 0.15,
    variations: {
      paquete: [
        { value: 'Consola Solo', price: 39900 },
        { value: 'Paquete Mario Kart', price: 45900 },
        { value: 'Paquete Zelda', price: 49900 },
        { value: 'Paquete Pro Controller', price: 46900 },
        { value: 'Paquete Deluxe', price: 54900 },
      ],
    }
  },
  {
    id: '3',
    name: 'Samsung 75" QLED 4K TV',
    maxDiscount: 0.25,
    variations: {
      modelo: [
        { value: 'Q70D', price: 189900 },
        { value: 'Q80D', price: 229900 },
        { value: 'Q90D', price: 269900 },
        { value: 'QN90D Neo QLED', price: 319900 },
        { value: 'QN95D Neo QLED', price: 369900 },
      ],
      garantia: [
        { value: '1 Año Estándar', price: 0 },
        { value: '3 Años Extendida', price: 19900 },
        { value: '5 Años Premium', price: 39900 },
      ]
    }
  },
  {
    id: '4',
    name: 'Apple MacBook Pro 16"',
    maxDiscount: 0.1,
    variations: {
      procesador: [
        { value: 'M4 Pro 12-core', price: 249900 },
        { value: 'M4 Pro 14-core', price: 299900 },
        { value: 'M4 Max 14-core', price: 399900 },
        { value: 'M4 Max 16-core', price: 499900 },
      ],
      memoria: [
        { value: '18GB', price: 0 },
        { value: '36GB', price: 40000 },
        { value: '48GB', price: 60000 },
        { value: '128GB', price: 160000 },
      ],
      almacenamiento: [
        { value: '512GB SSD', price: 0 },
        { value: '1TB SSD', price: 20000 },
        { value: '2TB SSD', price: 60000 },
        { value: '4TB SSD', price: 120000 },
        { value: '8TB SSD', price: 240000 },
      ]
    }
  },
  {
    id: '5',
    name: 'Sony PlayStation 5 Pro',
    maxDiscount: 0.12,
    variations: {
      edicion: [
        { value: 'Edición Estándar', price: 59900 },
        { value: 'Edición Digital', price: 49900 },
        { value: 'Edición Coleccionista', price: 69900 },
      ],
      paquete: [
        { value: 'Solo Consola', price: 0 },
        { value: 'Paquete Spider-Man 2', price: 7000 },
        { value: 'Paquete God of War', price: 7000 },
        { value: 'Paquete Control Extra', price: 8000 },
        { value: 'Paquete Premium', price: 15000 },
      ]
    }
  },
  {
    id: '6',
    name: 'Samsung Galaxy S25 Ultra',
    maxDiscount: 0.15,
    variations: {
      almacenamiento: [
        { value: '256GB', price: 129900 },
        { value: '512GB', price: 149900 },
        { value: '1TB', price: 169900 },
      ],
      color: [
        { value: 'Titanium Black', price: 0 },
        { value: 'Titanium Gray', price: 0 },
        { value: 'Titanium White', price: 0 },
        { value: 'Titanium Blue', price: 0 },
      ]
    }
  },
  {
    id: '7',
    name: 'LG 65" OLED C4 Smart TV',
    maxDiscount: 0.2,
    variations: {
      tamaño: [
        { value: '55"', price: 139900 },
        { value: '65"', price: 179900 },
        { value: '77"', price: 249900 },
        { value: '83"', price: 349900 },
      ],
      garantia: [
        { value: '1 Año Estándar', price: 0 },
        { value: '3 Años Extendida', price: 25000 },
        { value: '5 Años Premium', price: 45000 },
      ]
    }
  },
  {
    id: '8',
    name: 'WD Black SN850X NVMe SSD',
    maxDiscount: 0.2,
    variations: {
      capacidad: [
        { value: '500GB', price: 8900 },
        { value: '1TB', price: 12900 },
        { value: '2TB', price: 22900 },
        { value: '4TB', price: 45900 },
      ],
      disipador: [
        { value: 'Sin Disipador', price: 0 },
        { value: 'Con Disipador', price: 1500 },
      ]
    }
  },
  {
    id: '9',
    name: 'Sony WH-1000XM5 Headphones',
    maxDiscount: 0.25,
    variations: {
      color: [
        { value: 'Negro', price: 39900 },
        { value: 'Plata', price: 39900 },
        { value: 'Azul Medianoche', price: 41900 },
      ],
      garantia: [
        { value: '1 Año Estándar', price: 0 },
        { value: '2 Años Extendida', price: 4900 },
        { value: '3 Años Premium', price: 7900 },
      ]
    }
  }, 
  {
    id: '10',
    name: 'iPad Air 11" M2',
    price: 59900,
    maxDiscount: 0.08,
    variations: {
      almacenamiento: [
        { value: '128GB', price: 59900 },
        { value: '256GB', price: 69900 },
        { value: '512GB', price: 89900 },
        { value: '1TB', price: 109900 },
      ],
      conectividad: [
        { value: 'Wi-Fi', price: 0 },
        { value: 'Wi-Fi + Cellular', price: 15000 },
      ]
    }
  },
  {
    id: '11',
    name: 'Apple Watch Series 10',
    price: 39900,
    maxDiscount: 0.15,
    variations: {
      tamaño: [
        { value: '42mm', price: 39900 },
        { value: '46mm', price: 42900 },
      ],
      carcasa: [
        { value: 'Aluminio', price: 0 },
        { value: 'Acero Inoxidable', price: 30000 },
        { value: 'Titanio', price: 50000 },
      ],
      conectividad: [
        { value: 'GPS', price: 0 },
        { value: 'GPS + Cellular', price: 12000 },
      ]
    }
  },
  {
    id: 'ujuyj',
    name: 'Gaming PC Build',
    maxDiscount: 0.10,
    variations: {
      cpu: [
        { value: 'AMD Ryzen 7 9700X', price: 68000 },
        { value: 'AMD Ryzen 9 9900X', price: 74800 },
        { value: 'Intel Core i9-14900K', price: 81600 }
      ],
      gpu: [
        { value: 'RTX 4070', price: 0 },
        { value: 'RTX 4080 Super', price: 15000 },
        { value: 'RTX 4090', price: 25000 }
      ],
      memoria: [
        { value: '16GB DDR5', price: 0 },
        { value: '32GB DDR5', price: 5000 },
        { value: '64GB DDR5', price: 10000 }
      ],
      almacenamiento: [
        { value: '1TB NVMe', price: 0 },
        { value: '2TB NVMe', price: 20000 },
        { value: '4TB NVMe', price: 30000 }
      ]
    }
  },
  {
    id: '12',
    name: 'Grand Theft Auto VI',
    maxDiscount: 0.05,
    variations: {
      plataforma: [
        { value: 'PlayStation 5', price: 7999 },
        { value: 'Xbox Series X/S', price: 7999 },
        { value: 'PC (Steam)', price: 6999 },
        { value: 'PC (Epic Games)', price: 6999 },
      ],
      edicion: [
        { value: 'Edición Estándar', price: 0 },
        { value: 'Edición Deluxe', price: 2000 },
        { value: 'Edición Coleccionista', price: 15000 },
        { value: 'Edición Ultimate', price: 5000 },
      ]
    }
  },
  {
    id: '13',
    name: 'Steam Deck OLED 2',
    maxDiscount: 0.08,
    variations: {
      almacenamiento: [
        { value: '512GB', price: 59900 },
        { value: '1TB', price: 69900 },
        { value: '2TB', price: 89900 },
      ],
      color: [
        { value: 'Steam Blue', price: 0 },
        { value: 'Cosmic Black', price: 0 },
        { value: 'Limited White', price: 2000 },
      ]
    }
  },
  {
    id: '14',
    name: 'Apple AirPods Pro 3',
    maxDiscount: 0.12,
    variations: {
      estuche: [
        { value: 'Estuche Lightning', price: 29900 },
        { value: 'Estuche USB-C', price: 29900 },
        { value: 'Estuche MagSafe', price: 32900 },
      ],
      color: [
        { value: 'Blanco', price: 0 },
        { value: 'Gris Espacial', price: 0 },
        { value: 'Medianoche', price: 0 },
      ]
    }
  },
  {
    id: '15',
    name: 'Meta Quest 4',
    maxDiscount: 0.1,
    variations: {
      almacenamiento: [
        { value: '128GB', price: 49900 },
        { value: '256GB', price: 59900 },
        { value: '512GB', price: 79900 },
      ],
      paquete: [
        { value: 'Solo Visor', price: 0 },
        { value: 'Paquete Elite Strap', price: 8000 },
        { value: 'Paquete Pro', price: 15000 },
        { value: 'Paquete Completo', price: 25000 },
      ]
    }
  },
  {
    id: '16',
    name: 'NVIDIA GeForce RTX 5080',
    maxDiscount: 0.05,
    variations: {
      memoria: [
        { value: '16GB GDDR7', price: 119900 },
        { value: '24GB GDDR7', price: 139900 },
      ],
      refrigeracion: [
        { value: 'Founders Edition', price: 0 },
        { value: 'MSI Gaming X Trio', price: 8000 },
        { value: 'ASUS ROG Strix', price: 12000 },
        { value: 'EVGA FTW3', price: 10000 },
      ]
    }
  },
  {
    id: '18',
    name: 'Tesla Model Pi Phone',
    maxDiscount: 0.08,
    variations: {
      almacenamiento: [
        { value: '256GB', price: 149900 },
        { value: '512GB', price: 169900 },
        { value: '1TB', price: 199900 },
      ],
      conectividad: [
        { value: '5G', price: 0 },
        { value: '5G + Starlink', price: 30000 },
      ],
      color: [
        { value: 'Cyber Silver', price: 0 },
        { value: 'Mars Red', price: 0 },
        { value: 'Space Black', price: 0 },
      ]
    }
  },
  {
    id: '19',
    name: 'Microsoft Surface Pro 11',
    maxDiscount: 0.15,
    variations: {
      procesador: [
        { value: 'Snapdragon X Elite', price: 109900 },
        { value: 'Intel Core Ultra 7', price: 129900 },
        { value: 'Intel Core Ultra 9', price: 159900 },
      ],
      memoria: [
        { value: '16GB', price: 0 },
        { value: '32GB', price: 40000 },
        { value: '64GB', price: 80000 },
      ],
      almacenamiento: [
        { value: '256GB SSD', price: 0 },
        { value: '512GB SSD', price: 20000 },
        { value: '1TB SSD', price: 40000 },
        { value: '2TB SSD', price: 80000 },
      ]
    }
  },
  {
    id: '20',
    name: 'Google Pixel 9 Pro',
    maxDiscount: 0.12,
    variations: {
      almacenamiento: [
        { value: '128GB', price: 89900 },
        { value: '256GB', price: 99900 },
        { value: '512GB', price: 119900 },
        { value: '1TB', price: 149900 },
      ],
      color: [
        { value: 'Obsidian', price: 0 },
        { value: 'Porcelain', price: 0 },
        { value: 'Bay', price: 0 },
        { value: 'Rose', price: 0 },
      ]
    }
  },
  {
    id: '21',
    name: 'Framework Laptop 16',
    maxDiscount: 0.1,
    variations: {
      procesador: [
        { value: 'AMD Ryzen 7 9700HX', price: 159900 },
        { value: 'AMD Ryzen 9 9900HX', price: 189900 },
        { value: 'Intel Core i7-14700H', price: 169900 },
      ],
      gpu: [
        { value: 'Integrated Graphics', price: 0 },
        { value: 'RTX 4060 Module', price: 60000 },
        { value: 'RTX 4070 Module', price: 80000 },
      ],
      memoria: [
        { value: '32GB DDR5', price: 0 },
        { value: '64GB DDR5', price: 40000 },
        { value: '128GB DDR5', price: 120000 },
      ]
    }
  },
  {
    id: '22',
    name: 'Nothing Phone 3',
    maxDiscount: 0.18,
    variations: {
      almacenamiento: [
        { value: '256GB', price: 69900 },
        { value: '512GB', price: 79900 },
        { value: '1TB', price: 99900 },
      ],
      color: [
        { value: 'Black', price: 0 },
        { value: 'White', price: 0 },
        { value: 'Transparent', price: 5000 },
      ]
    }
  },
  {
    id: '23',
    name: 'Razer Blade 18 (2025)',
    maxDiscount: 0.08,
    variations: {
      procesador: [
        { value: 'Intel i9-14900HX', price: 349900 },
        { value: 'Intel i9-15900HX', price: 399900 },
      ],
      gpu: [
        { value: 'RTX 4080', price: 0 },
        { value: 'RTX 4090', price: 50000 },
        { value: 'RTX 5080', price: 80000 },
      ],
      memoria: [
        { value: '32GB DDR5', price: 0 },
        { value: '64GB DDR5', price: 60000 },
        { value: '128GB DDR5', price: 150000 },
      ],
      almacenamiento: [
        { value: '1TB SSD', price: 0 },
        { value: '2TB SSD', price: 40000 },
        { value: '4TB SSD', price: 120000 },
      ]
    }
  },
  {
    id: '24',
    name: 'Samsung Galaxy Z Fold 7',
    maxDiscount: 0.14,
    variations: {
      almacenamiento: [
        { value: '256GB', price: 179900 },
        { value: '512GB', price: 199900 },
        { value: '1TB', price: 229900 },
      ],
      color: [
        { value: 'Phantom Black', price: 0 },
        { value: 'Cream', price: 0 },
        { value: 'Green', price: 0 },
        { value: 'Blue', price: 0 },
      ]
    }
  },
  {
    id: '25',
    name: 'Apple Vision Pro 2',
    maxDiscount: 0.05,
    variations: {
      almacenamiento: [
        { value: '256GB', price: 349900 },
        { value: '512GB', price: 369900 },
        { value: '1TB', price: 399900 },
      ],
      graduación: [
        { value: 'Sin graduar', price: 0 },
        { value: 'ZEISS Optical Inserts', price: 15000 },
        { value: 'ZEISS Reading Inserts', price: 12000 },
      ]
    }
  }
];

export default products;