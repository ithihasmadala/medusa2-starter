import { URLAwareNavLink } from '@app/components/common/link';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { StoreCollection } from '@medusajs/types';
import { FC, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface CollectionDropdownProps {
  collections: StoreCollection[];
}

export const CollectionDropdown: FC<CollectionDropdownProps> = ({ collections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to allow moving to dropdown
  };

  const handleClick = () => {
    setIsOpen(false);
    navigate('/collections');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!collections?.length) return null;

  return (
    <div className="relative inline-block text-left" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className="inline-flex w-full justify-center items-center gap-x-1.5 text-base font-normal text-white hover:underline"
        onClick={handleClick}
      >
        Shop by Collection
        <ChevronDownIcon className="-mr-1 h-5 w-5 text-white" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md shadow-2xl border-2 border-gray-300 focus:outline-none"
          style={{
            backgroundColor: '#ffffff',
            opacity: '1',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1 max-h-80 overflow-y-auto">
            {collections.map((collection) => (
              <URLAwareNavLink
                key={collection.id}
                url={`/collections/${collection.handle}`}
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                prefetch="viewport"
              >
                {collection.title}
              </URLAwareNavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
