import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { PageHeading } from '@app/components/sections/PageHeading';
import { fetchCollections } from '@libs/util/server/data/collections.server';
import { fetchProducts } from '@libs/util/server/products.server';
import { withPaginationParams } from '@libs/util/withPaginationParams';
import clsx from 'clsx';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { NavLink, useLoaderData } from 'react-router';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRef, useState, useEffect } from 'react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const handle = params.collectionHandle as string;

  const { collections } = await fetchCollections();

  const collection = collections?.find((collection) => collection.handle === handle);

  if (!collection) throw redirect('/products');

  const { limit, offset } = withPaginationParams({
    request,
    defaultPageSize: 12,
  });

  const { products, count } = await fetchProducts(request, {
    collection_id: collection.id,
    limit,
    offset,
  });

  return { products, count, limit, offset, collections, collection };
};

export type ProductCollectionRouteLoader = typeof loader;

function CollectionCarousel({
  collections,
  currentCollectionHandle,
}: { collections: any[]; currentCollectionHandle: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollToActiveCollection = () => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector('[aria-current="page"]') as HTMLElement;
      if (activeElement) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        const scrollLeft = scrollContainerRef.current.scrollLeft;

        // Calculate the position to center the active element
        const elementCenter = elementRect.left - containerRect.left + scrollLeft + elementRect.width / 2;
        const containerCenter = containerRect.width / 2;
        const targetScrollLeft = elementCenter - containerCenter;

        scrollContainerRef.current.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    checkScrollButtons();
    // Auto-scroll to active collection after a short delay to ensure DOM is ready
    const timer = setTimeout(scrollToActiveCollection, 100);

    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [collections, currentCollectionHandle]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Increased from 200 to 400 for more scrolling
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <style>{`
        .collection-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={clsx(
            'absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200',
            {
              'opacity-50 cursor-not-allowed': !canScrollLeft,
              'hover:shadow-xl': canScrollLeft,
            },
          )}
          disabled={!canScrollLeft}
          aria-label="Scroll collections left"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 text-lg md:text-2xl font-italiana border-b border-primary mt-4 mb-8 overflow-x-auto px-8 md:px-12 collection-scroll-container"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onScroll={checkScrollButtons}
        >
          {collections.map((collection) => (
            <NavLink
              to={`/collections/${collection.handle}`}
              key={collection.id}
              className={({ isActive }) =>
                clsx('h-full p-3 md:p-4 whitespace-nowrap flex-shrink-0 transition-all duration-200', {
                  'font-bold border-b-2 border-primary text-primary': isActive,
                  'hover:text-primary/80': !isActive,
                })
              }
            >
              {collection.title}
            </NavLink>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={clsx(
            'absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200',
            {
              'opacity-50 cursor-not-allowed': !canScrollRight,
              'hover:shadow-xl': canScrollRight,
            },
          )}
          disabled={!canScrollRight}
          aria-label="Scroll collections right"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </>
  );
}

export default function ProductCollectionRoute() {
  const data = useLoaderData<ProductCollectionRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, collections, collection } = data;

  return (
    <Container className="pb-16">
      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 font-normal lg:font-normal">
        {collection.title}
      </PageHeading>

      {collections.length > 1 && (
        <div className="w-full">
          <CollectionCarousel collections={collections} currentCollectionHandle={collection.handle} />
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <ProductListWithPagination
            products={products}
            paginationConfig={{ count, offset, limit }}
            context={`collections/${collection.handle}`}
          />
        </div>
      </div>
    </Container>
  );
}
