import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import clsx from 'clsx';

export interface SearchInputProps {
  className?: string;
  placeholder?: string;
  variant?: 'header' | 'hero' | 'footer' | 'mobile-nav';
  onSearch?: () => void;
}

export function SearchInput({
  className,
  placeholder = 'Search products...',
  variant = 'header',
  onSearch,
}: SearchInputProps) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
      inputRef.current?.blur();
      onSearch?.();
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isExpanded) {
      setIsExpanded(true);
      // Focus the input after expansion
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else if (query.trim()) {
      // If expanded and has query, submit the form
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
      inputRef.current?.blur();
      onSearch?.();
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    // Delay collapse to allow for form submission
    setTimeout(() => {
      if (!query.trim()) {
        setIsExpanded(false);
      }
    }, 150);
  };

  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    setQuery(currentQuery);
    if (currentQuery) {
      setIsExpanded(true);
    }
  }, [searchParams]);

  // Mobile navigation variant - clean and simple
  if (variant === 'mobile-nav') {
    return (
      <div className={clsx('w-full', className)}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus-within:bg-white focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all duration-200">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none focus:outline-none focus:ring-0 rounded-l-lg"
            />
            <button
              type="submit"
              className="h-12 w-12 text-gray-400 hover:text-gray-600 flex-shrink-0 flex items-center justify-center rounded-r-lg focus:outline-none focus:ring-0 transition-colors duration-200"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Hero variant with improved mobile responsiveness
  if (variant === 'hero') {
    return (
      <div className={clsx('w-full', className)}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl focus-within:shadow-xl focus-within:border-gray-300 transition-all duration-200">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base sm:text-lg rounded-l-full min-w-0"
            />
            <button
              type="submit"
              className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 hover:text-gray-600 flex-shrink-0 flex items-center justify-center rounded-r-full focus:outline-none focus:ring-0"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={clsx('w-full', className)}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/15 focus-within:bg-white/15 focus-within:border-white/30 transition-all duration-200">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 text-white placeholder-white/70 bg-transparent border-none outline-none focus:outline-none focus:ring-0 rounded-l-full"
            />
            <button
              type="submit"
              className="h-10 w-10 text-white/70 hover:text-white flex-shrink-0 flex items-center justify-center rounded-r-full focus:outline-none focus:ring-0"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default header variant with improved mobile behavior
  return (
    <div className={clsx('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={clsx(
            'flex items-center transition-all duration-200 ease-in-out',
            isExpanded
              ? 'w-48 sm:w-64 bg-white rounded-md shadow-lg border border-gray-200'
              : 'w-8 sm:w-10 bg-transparent',
          )}
        >
          <button
            type="button"
            onClick={handleButtonClick}
            className={clsx(
              'flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-0 flex-shrink-0',
              isExpanded
                ? 'h-8 w-8 sm:h-10 sm:w-10 text-gray-400 hover:text-gray-600'
                : 'h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-gray-300',
            )}
            aria-label={isExpanded ? 'Search' : 'Open search'}
          >
            <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={clsx(
              'transition-all duration-200 ease-in-out border-none outline-none focus:outline-none focus:ring-0 bg-transparent text-sm sm:text-base',
              isExpanded
                ? 'flex-1 px-2 py-2 text-gray-900 placeholder-gray-500 min-w-0'
                : 'w-0 opacity-0 pointer-events-none',
            )}
          />
        </div>
      </form>
    </div>
  );
}
