import { URLAwareNavLink } from '@app/components/common/link';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { SearchInput } from './SearchInput';
import clsx from 'clsx';
import { Fragment, useState } from 'react';

export interface HeaderSideNavProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  activeSection?: string | null;
}

export const HeaderSideNav = ({ open = false, setOpen, activeSection }: HeaderSideNavProps) => {
  const { headerNavigationItems } = useSiteDetails();
  const rootData = useRootLoaderData();
  const categories = rootData?.categories || [];
  const collections = rootData?.collections || [];
  const [showCategories, setShowCategories] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  if (!headerNavigationItems) return null;

  return (
    <Dialog open={open} onClose={() => setOpen?.(false)} className="relative z-40 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 z-40 flex">
        <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
          <div className="flex px-4 pb-2 pt-5">
            <button
              type="button"
              className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              onClick={() => setOpen?.(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-2">
            {/* Search Section */}
            <div className="px-4 pb-4 border-b border-gray-200">
              <SearchInput
                variant="mobile-nav"
                className="w-full"
                placeholder="Search products..."
                onSearch={() => setOpen?.(false)}
              />
            </div>

            <nav className="px-4 pb-8">
              <ul className="divide-y divide-gray-200">
                {/* Categories Section */}
                <li className="py-3">
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="flex w-full items-center justify-between text-base font-medium text-gray-600"
                  >
                    <span>Shop by Category</span>
                    <ChevronRightIcon
                      className={clsx('h-5 w-5 transition-transform', {
                        'rotate-90': showCategories,
                      })}
                    />
                  </button>
                  {showCategories && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <URLAwareNavLink
                            url={`/categories/${category.handle}`}
                            className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => setOpen?.(false)}
                            prefetch="viewport"
                          >
                            {category.name}
                          </URLAwareNavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Collections Section */}
                <li className="py-3">
                  <button
                    onClick={() => setShowCollections(!showCollections)}
                    className="flex w-full items-center justify-between text-base font-medium text-gray-600"
                  >
                    <span>Shop by Collection</span>
                    <ChevronRightIcon
                      className={clsx('h-5 w-5 transition-transform', {
                        'rotate-90': showCollections,
                      })}
                    />
                  </button>
                  {showCollections && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {collections.map((collection) => (
                        <li key={collection.id}>
                          <URLAwareNavLink
                            url={`/collections/${collection.handle}`}
                            className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => setOpen?.(false)}
                            prefetch="viewport"
                          >
                            {collection.title}
                          </URLAwareNavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Regular Navigation Items */}
                {headerNavigationItems.map(({ id, new_tab, ...navItemProps }) => (
                  <li key={id} className="py-3">
                    <URLAwareNavLink
                      {...navItemProps}
                      newTab={new_tab}
                      className={({ isActive }) =>
                        clsx('block text-base font-medium', {
                          'text-gray-900 font-bold':
                            isActive &&
                            (!navItemProps.url.includes('#') ||
                              activeSection === navItemProps.url.split('#')[1].split('?')[0]),
                          'text-gray-600':
                            !isActive ||
                            (navItemProps.url.includes('#') &&
                              activeSection !== navItemProps.url.split('#')[1].split('?')[0]),
                        })
                      }
                      onClick={() => setOpen?.(false)}
                      prefetch="viewport"
                    >
                      {navItemProps.label}
                    </URLAwareNavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
