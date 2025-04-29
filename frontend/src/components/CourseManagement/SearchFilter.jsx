import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, ChevronDown, Check, Sliders } from 'lucide-react';

/**
 * Enhanced search and filter component with advanced filtering options
 * 
 * @param {Object} props
 * @param {string} props.searchValue - Current search value
 * @param {Function} props.onSearchChange - Handler for search value changes
 * @param {string} props.searchPlaceholder - Placeholder text for search input
 * @param {string} props.filterValue - Current filter value
 * @param {Function} props.onFilterChange - Handler for filter value changes
 * @param {Array} props.filterOptions - Available filter options
 * @param {Array} props.searchFields - Fields to search on (for advanced search)
 * @param {Object} props.advancedFilters - Advanced filter state
 * @param {Function} props.onAdvancedFilterChange - Handler for advanced filter changes
 */
const SearchFilter = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue = '',
  onFilterChange,
  filterOptions = [],
  searchFields = [],
  advancedFilters = {},
  onAdvancedFilterChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFieldsOpen, setSearchFieldsOpen] = useState(false);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const dropdownRef = useRef(null);
  const searchFieldsRef = useRef(null);
  const advancedFilterRef = useRef(null);

  // Initialize selected fields to all fields if none are selected
  useEffect(() => {
    if (selectedFields.length === 0 && searchFields.length > 0) {
      setSelectedFields(searchFields.map(field => field.id));
    }
  }, [searchFields]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchFieldsRef.current && !searchFieldsRef.current.contains(event.target)) {
        setSearchFieldsOpen(false);
      }
      if (advancedFilterRef.current && !advancedFilterRef.current.contains(event.target)) {
        setAdvancedFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save search to recent searches when user submits
  const handleSearchSubmit = () => {
    if (searchValue && !recentSearches.includes(searchValue)) {
      const newRecentSearches = [searchValue, ...recentSearches].slice(0, 5);
      setRecentSearches(newRecentSearches);
      
      // Could save to localStorage here
      // localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }
  };

  // Handle key press for search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Toggle search field selection
  const toggleSearchField = (fieldId) => {
    if (selectedFields.includes(fieldId)) {
      // Don't allow deselecting all fields
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter(id => id !== fieldId));
      }
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  // Get currently active filter label
  const getActiveFilterLabel = () => {
    const activeFilter = filterOptions.find(option => option.value === filterValue);
    return activeFilter ? activeFilter.label : 'Filter';
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={searchPlaceholder}
            className="block w-full rounded-lg border border-gray-200 pl-10 py-2.5 pr-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            autoComplete="off"
            onFocus={() => setDropdownOpen(true)}
          />
          
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-10 flex items-center pr-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setSearchFieldsOpen(!searchFieldsOpen)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            title="Select search fields"
          >
            <Sliders className="h-4 w-4" />
          </button>
          
          {/* Search dropdown with suggestions and recent searches */}
          {dropdownOpen && (searchValue || recentSearches.length > 0) && (
            <div 
              ref={dropdownRef} 
              className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
            >
              {searchValue && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Search for "{searchValue}"
                </div>
              )}
              
              {recentSearches.length > 0 && !searchValue && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        onSearchChange(search);
                        setDropdownOpen(false);
                      }}
                    >
                      {search}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 px-4 py-2">
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => setRecentSearches([])}
                    >
                      Clear recent searches
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Search fields selection dropdown */}
          {searchFieldsOpen && searchFields.length > 0 && (
            <div 
              ref={searchFieldsRef}
              className="absolute right-0 top-full z-10 mt-1 w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
            >
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Search in Fields
              </div>
              
              {searchFields.map((field) => (
                <div 
                  key={field.id} 
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleSearchField(field.id)}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                    selectedFields.includes(field.id) 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedFields.includes(field.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-100 px-4 py-2 flex justify-between">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedFields(searchFields.map(field => field.id))}
                >
                  Select all
                </button>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setSearchFieldsOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        
        {filterOptions.length > 0 && (
          <div className="relative min-w-40">
            <button
              type="button"
              onClick={() => setAdvancedFilterOpen(!advancedFilterOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <span>{getActiveFilterLabel()}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {advancedFilterOpen && (
              <div 
                ref={advancedFilterRef}
                className="absolute right-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                      filterValue === option.value 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      onFilterChange(option.value);
                      setAdvancedFilterOpen(false);
                    }}
                  >
                    <span className="mr-2">
                      {option.icon || <div className="h-4 w-4" />}
                    </span>
                    {option.label}
                    {filterValue === option.value && (
                      <Check className="ml-auto h-4 w-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <button 
          type="button"
          onClick={handleSearchSubmit}
          className="hidden sm:block px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
      
      {/* Active filters display */}
      {selectedFields.length < searchFields.length && searchFields.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Searching in:</span>
          {searchFields
            .filter(field => selectedFields.includes(field.id))
            .map(field => (
              <span 
                key={field.id}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {field.label}
                <button 
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={() => toggleSearchField(field.id)}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          }
        </div>
      )}
      
      {/* Active filter display */}
      {filterValue && filterValue !== 'all' && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Active filter:</span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {getActiveFilterLabel()}
            <button 
              type="button"
              className="ml-1 text-blue-600 hover:text-blue-800"
              onClick={() => onFilterChange('all')}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;