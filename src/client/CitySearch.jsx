import { useState, useMemo, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';

const fuseCitySearchOptions = {
  keys: ['municipio'],
  useExtendedSearch: true,
  ignoreLocation: true,
};

/**
 * @param {string} props.id - id + name
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Callback triggered on value change
 * @param {boolean} [props.hasError=false] - Error for styling
 * @param {string} [props.className=''] - Additional CSS
 * @param {Set} [props.cities] - Valid cities for search
 */
export default function CitySearch({ id, value, onChange, cities, hasError = false, className = '' }) {

  const [searchTerm, setSearchTerm] = useState(value || '');
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedResultIndex, setHighlightedResultIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false); // Used to hide search results

  const highlightedItemRef = useRef(null);
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);

  const fuse = useMemo(() => new Fuse(cities, fuseCitySearchOptions), [cities]);

  const areSearchResultsVisible = searchTerm.trim() !== '' && searchResults.length > 0 && isActive;

  // Search and update search results
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const results = fuse.search(searchTerm).map(result => result.item);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setHighlightedResultIndex(-1); // Reset highlight on new search
  }, [searchTerm, fuse]);

  // Keep highlisted result visible
  useEffect(() => {
    if (highlightedResultIndex >= 0 && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedResultIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  function handleInputChange(event) {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onChange({ target: { id: id, value: newSearchTerm } });
    setIsActive(true);
  }

  function handleClearSearch() {
    setSearchTerm('');
    onChange({ target: { id: id, value: ''} });
    setIsActive(false);
    searchInputRef.current?.focus();
  }

  function handleSelectCity(city) {
    setSearchTerm(city);
    onChange({ target: { id: id, value: city } });
    setIsActive(false);
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsActive(true);
        setHighlightedResultIndex(prevIndex =>
          prevIndex >= searchResults.length - 1 ? 0 : prevIndex + 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsActive(true);
        setHighlightedResultIndex(prevIndex =>
          prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (areSearchResultsVisible && highlightedResultIndex >= 0) {
          handleSelectCity(searchResults[highlightedResultIndex]);
        }
        break;
      case 'Escape':
        setIsActive(false);
        break;
    }
  }

  const inputClasses = `
    text-sm pl-10 pr-10 py-2 rounded-md w-full border-2
    ${hasError ? 'border-red-500' : 'border-gray-400'}
    focus:outline-none focus:border-blue-800
    ${className}
  `;

  return (
    <div className="relative" ref={containerRef}>

      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search strokeWidth={2.5} className="h-5 w-5 text-gray-400" />
      </div>

      {/* Text Input */}
      <input
        type="text"
        id={id}
        name={id}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsActive(true)}
        ref={searchInputRef}
        className={inputClasses}
      />

      {/* Clear Button X */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-0 p-3 flex items-center cursor-pointer"
          aria-label="Clear search"
          tabIndex="-1"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}

      {/* Search Results */}
      {areSearchResultsVisible && (
        <div className="border-2 border-gray-400 rounded-md max-h-60 bg-white
                        w-full overflow-y-auto absolute z-10 left-0 right-0 mt-1 shadow-xl">
          <ul>
            {searchResults.map((city, index) => {
              const isHighlighted = index === highlightedResultIndex;
              return (
                <li
                  key={index}
                  ref={isHighlighted ? highlightedItemRef : null}
                  className={`
                     p-2 pl-3 text-sm hover:bg-gray-100 cursor-pointer
                     ${isHighlighted ? 'bg-blue-100' : ''}
                  `}
                  onClick={() => handleSelectCity(city)}
                  onMouseEnter={() => setHighlightedResultIndex(index)}
                >
                  {city}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}