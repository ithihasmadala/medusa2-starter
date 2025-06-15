import { LogoStoreName } from '@app/components/LogoStoreName/LogoStoreName';
import { IconButton } from '@app/components/common/buttons';
import { Container } from '@app/components/common/container/Container';
import { URLAwareNavLink } from '@app/components/common/link';
import { useCart } from '@app/hooks/useCart';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { CategoryDropdown } from './CategoryDropdown';
import { CollectionDropdown } from './CollectionDropdown';
import { HeaderSideNav } from './HeaderSideNav';
import { SearchInput } from './SearchInput';
import { useActiveSection } from './useActiveSection';

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(false);
  const { headerNavigationItems } = useSiteDetails();
  const { cart, toggleCartDrawer } = useCart();
  const { activeSection } = useActiveSection(headerNavigationItems);
  const rootLoader = useRootLoaderData();
  const hasProducts = rootLoader?.hasPublishedProducts;
  const categories = rootLoader?.categories || [];
  const collections = rootLoader?.collections || [];

  if (!headerNavigationItems) return <>Loading...</>;

  return (
    <header className="sticky top-0 z-40 mkt-header text-white bg-[#3F432C] opacity-75 backdrop-blur">
      <nav aria-label="Top">
        <div className="bg-transparent">
          <div className="">
            <Container>
              {hasProducts && (
                <div className="-mb-2 flex w-full items-center justify-end gap-4 pt-2 sm:hidden">
                  {!!cart && (
                    <IconButton
                      aria-label="open shopping cart"
                      className="text-white sm:mr-0.5"
                      icon={(iconProps) => (
                        <div className="relative">
                          <ShoppingBagIcon
                            {...iconProps}
                            className={clsx(iconProps.className, 'hover:!bg-primary-50 focus:!bg-primary-50')}
                          />
                          {cart.items && cart.items.length > 0 && (
                            <span className="bg-primary-500 absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-xs font-bold text-white">
                              <span>
                                {cart.items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                                <span className="sr-only">items in cart, view bag</span>
                              </span>
                            </span>
                          )}
                        </div>
                      )}
                      onClick={() => toggleCartDrawer(true)}
                    />
                  )}

                  <div className="flex-auto" />
                </div>
              )}

              <div
                className={clsx(
                  'h-[var(--mkt-header-height)] flex sm:h-[var(--mkt-header-height-desktop)] flex-nowrap items-center justify-between gap-2 py-2',
                )}
              >
                <LogoStoreName className="xs:h-14 h-8" primary />
                <div className="flex items-center gap-x-6">
                  {headerNavigationItems && (
                    <div className="hidden h-full items-center gap-6 md:flex">
                      {/* Category and Collection Dropdowns */}
                      <CategoryDropdown categories={categories} />
                      <CollectionDropdown collections={collections} />

                      {/* Existing navigation items */}
                      {headerNavigationItems
                        .filter((item) => item.label !== 'View our Blends')
                        .slice(0, 2)
                        .map(({ id, new_tab, ...navItemProps }, index) => (
                          <URLAwareNavLink
                            key={id}
                            {...navItemProps}
                            newTab={new_tab}
                            className={({ isActive }) =>
                              clsx(
                                'flex items-center whitespace-nowrap text-base font-normal hover:text-gray-300 transition-colors',
                                {
                                  'hover:underline': !isActive,
                                  'border-b-primary-200 border-b-2':
                                    isActive &&
                                    (!navItemProps.url.includes('#') ||
                                      activeSection === navItemProps.url.split('#')[1].split('?')[0]),
                                },
                              )
                            }
                            prefetch="viewport"
                          >
                            {navItemProps.label}
                          </URLAwareNavLink>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    {/* Search Input */}
                    <SearchInput className="hidden md:block mr-4" />

                    <div className="flex items-center gap-x-3 text-sm">
                      {!!cart && hasProducts && (
                        <IconButton
                          aria-label="open shopping cart"
                          className="text-white hidden sm:mr-0.5 sm:inline-flex focus-within:!bg-primary-50"
                          icon={(iconProps) => (
                            <div className="relative">
                              <ShoppingBagIcon
                                {...iconProps}
                                className={clsx(iconProps.className, 'hover:!bg-primary-50')}
                              />
                              {cart.items && cart.items.length > 0 && (
                                <span className="bg-primary-500 absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-xs font-bold text-white">
                                  <span>
                                    {cart.items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                                    <span className="sr-only">items in cart, view bag</span>
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                          onClick={() => toggleCartDrawer(true)}
                        />
                      )}
                      {/* Mobile navigation menu button */}
                      {!!headerNavigationItems?.length && (
                        <IconButton
                          aria-label="open navigation menu"
                          onClick={() => setSideNavOpen(true)}
                          className="hover:!bg-primary-50 focus:!bg-primary-50 sm:inline-flex text-white md:hidden"
                          icon={Bars3Icon}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </nav>
      <HeaderSideNav activeSection={activeSection} open={sideNavOpen} setOpen={setSideNavOpen} />
    </header>
  );
};
