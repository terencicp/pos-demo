import { useState, useMemo, useEffect, useContext, useRef } from 'react';
import Fuse from 'fuse.js'; // Fuzzy search
import { Search, X } from 'lucide-react'; // Icons

import products from '../data/products'; // TODO: Get data from IndexDB
import OrderContext from '../context/OrderContext';

const fuseProductSearchOptions = {
  keys: ['name'], // Product fields to search
  useExtendedSearch: true, // Treat spaces as logical ANDs
  ignoreLocation: true, // Position in string is irrelevant in ranking
};

export default function ProductSearch() {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Search result hightlighed when using keyboard up or down arrows
  const [highlightedResultIndex, setHighlightedResultIndex] = useState(-1);
  
  const highlightedItemRef = useRef(null);
  const searchInputRef = useRef(null);

  const { orderState, orderActions } = useContext(OrderContext);

  const fuse = useMemo(() => new Fuse(products, fuseProductSearchOptions), []);

  // Focus search bar only if no products
  useEffect(() => {
    const noProducts = orderState.products.length === 0;
    if (noProducts && !orderState.isReturnFlow) {
      searchInputRef.current.focus();
    }
  }, [orderState.products, orderState.returnOrder, orderState.isReturnFlow]);

  // Search and update search results
  useEffect(() => {
    let results = [];
    if (searchTerm.trim() !== '') {
      results = fuse.search(searchTerm).map(result => result.item);
    } else {
      results = [];
    }
    setSearchResults(results);
    setHighlightedResultIndex(-1);
  }, [searchTerm, fuse]);

  // Scroll to highlighted search result to make it visible
  useEffect(() => {
    if (highlightedResultIndex >= 0 && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        block: 'nearest'
      });
    }
  }, [highlightedResultIndex]);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleClearSearch() {
    setSearchTerm('');
  }

  function handleProductSelect(product) {
    // Products can be duplicated so they need unique keys
    const uniqueId = `${product.id}-${Date.now()}`;
    orderActions.addProduct({
      ...product,
      key: uniqueId,
      selectedVariations: {}
    });
    setSearchTerm('');
    searchInputRef.current.focus();
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        setHighlightedResultIndex(prevIndex =>
          prevIndex >= searchResults.length - 1 ? 0 : prevIndex + 1 // Wrap to top
        );
        break;
      case 'ArrowUp':
        setHighlightedResultIndex(prevIndex =>
          prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1 // Wrap to bottom
        );
        break;
      case 'Enter':
        if (highlightedResultIndex >= 0 && highlightedResultIndex < searchResults.length) {
          handleProductSelect(searchResults[highlightedResultIndex]);
        }
        break;
      case 'Escape':
        handleClearSearch();
        break;
    }
  };

  return (
    <div className="relative">

      {/* Title */}
      <h2 className="font-semibold text-lg mb-2">Productos</h2>

      {/* Search Bar */}
      <div className="relative mb-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search strokeWidth={2.5} className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input type="text" placeholder="Buscar..." value={searchTerm}
          onChange={handleSearchChange} onKeyDown={handleKeyDown}
          ref={searchInputRef}
          className="text-sm placeholder-gray-500 pl-10 pr-10 py-2 rounded-md w-full
            border-2 border-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
        />
        {searchTerm && (
          <button onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 p-3 flex items-center cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchTerm.trim() != '' && (
         <div className="border-2 border-gray-400 rounded-md max-h-80 bg-white
                         w-full overflow-y-auto absolute z-10 left-0 right-0 shadow-xl">
           {searchResults.length > 0 ? (
             <ul>
               {searchResults.map((product, index) => {
                 const isHighlighted = index === highlightedResultIndex;
                 return (
                   <li 
                     key={product.id}
                     ref={isHighlighted ? highlightedItemRef : null}
                     className={`
                        p-2 pl-3 text-sm hover:bg-gray-100 cursor-pointer
                        ${isHighlighted ? 'bg-blue-100' : ''}
                     `}
                     onClick={() => handleProductSelect(product)}
                   >
                     {product.name}
                   </li>
                 );
                })}
             </ul>
           ) : (
              <p className="p-2 text-sm text-center">No hay resultados</p>
           )}
         </div>
      )}
    </div>
  );
};