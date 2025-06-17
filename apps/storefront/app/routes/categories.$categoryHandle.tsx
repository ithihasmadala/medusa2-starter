import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { PageHeading } from '@app/components/sections/PageHeading';
import { listCategories } from '@libs/util/server/data/categories.server';
import { fetchProducts } from '@libs/util/server/products.server';
import { withPaginationParams } from '@libs/util/withPaginationParams';
import clsx from 'clsx';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { NavLink, useLoaderData } from 'react-router';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRef, useState, useEffect } from 'react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const handle = params.categoryHandle as string;

  const categories = await listCategories();

  const category = categories.find((c) => c.handle === handle);

  if (!category) {
    throw redirect('/products');
  }

  const { limit, offset } = withPaginationParams({
    request,
    defaultPageSize: 12,
  });

  const { products, count } = await fetchProducts(request, {
    category_id: category.id,
    limit,
    offset,
  });

  return {
    products,
    count,
    limit,
    offset,
    category,
    categories,
  };
};

export type ProductCategoryRouteLoader = typeof loader;

function CategoryCarousel({ categories, currentCategoryHandle }: { categories: any[]; currentCategoryHandle: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Find current category
  const currentCategory = categories.find((c) => c.handle === currentCategoryHandle);
  const parentCategories = categories.filter((cat) => !cat.parent_category_id);

  // Helper to get subcategories for a parent
  const getSubcategories = (parentId: string) => categories.filter((cat) => cat.parent_category_id === parentId);

  // Build the carousel items
  let carouselItems: { category: any; isSub: boolean }[] = [];

  if (currentCategory?.parent_category_id) {
    // On a subcategory: show parent, all siblings, highlight current
    const parent = categories.find((cat) => cat.id === currentCategory.parent_category_id);
    const siblings = getSubcategories(parent.id);
    carouselItems = [{ category: parent, isSub: false }, ...siblings.map((cat) => ({ category: cat, isSub: true }))];
  } else if (currentCategory) {
    // On a parent: show all parents, and if selected, show its subcategories after it
    parentCategories.forEach((parent) => {
      carouselItems.push({ category: parent, isSub: false });
      if (parent.id === currentCategory.id) {
        const subs = getSubcategories(parent.id);
        carouselItems.push(...subs.map((cat) => ({ category: cat, isSub: true })));
      }
    });
  } else {
    // Fallback: flat list
    carouselItems = parentCategories.map((cat) => ({ category: cat, isSub: false }));
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollToActiveCategory = () => {
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
    // Auto-scroll to active category after a short delay to ensure DOM is ready
    const timer = setTimeout(scrollToActiveCategory, 100);

    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [categories, currentCategoryHandle]);

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
        .category-scroll-container::-webkit-scrollbar {
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
          aria-label="Scroll categories left"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 text-lg md:text-2xl font-italiana border-b border-primary mt-4 mb-8 overflow-x-auto px-8 md:px-12 category-scroll-container"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onScroll={checkScrollButtons}
        >
          {carouselItems.map(({ category, isSub }) => (
            <NavLink
              to={`/categories/${category.handle}`}
              key={category.id}
              prefetch="viewport"
              className={({ isActive }) =>
                clsx(
                  'h-full flex-shrink-0 transition-all duration-200',
                  isSub
                    ? 'p-2 md:p-2.5 text-base md:text-lg text-gray-600 ml-2 pl-4 border-l border-primary/30'
                    : 'p-3 md:p-4 whitespace-nowrap',
                  {
                    'font-bold border-b-2 border-primary text-primary': isActive,
                    'hover:text-primary/80': !isActive,
                  },
                )
              }
              aria-current={category.handle === currentCategoryHandle ? 'page' : undefined}
            >
              {category.name}
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
          aria-label="Scroll categories right"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </>
  );
}

export default function ProductCategoryRoute() {
  const data = useLoaderData<ProductCategoryRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, categories, category } = data;

  // Only parent categories in the carousel
  const parentCategories = categories.filter((cat) => !cat.parent_category_id);
  const subcategories = categories.filter((cat) => cat.parent_category_id === category.id);

  return (
    <Container className="pb-16">
      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 font-normal lg:font-normal">
        {category.name}
      </PageHeading>

      {parentCategories.length > 1 && (
        <div className="w-full">
          <CategoryCarousel categories={parentCategories} currentCategoryHandle={category.handle} />
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          {subcategories.length > 0 ? (
            <div className="space-y-12">
              {subcategories.map((subcat) => {
                // Find products for this subcategory
                const subcatProducts = products.filter((p) => p.categories?.some((c) => c.id === subcat.id));
                return (
                  <div key={subcat.id}>
                    <h2 className="text-xl font-semibold mb-4">{subcat.name}</h2>
                    {subcatProducts.length > 0 ? (
                      <ProductListWithPagination products={subcatProducts} context={`categories/${subcat.handle}`} />
                    ) : (
                      <div className="text-gray-500 italic">No products available.</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : products.length > 0 ? (
            <ProductListWithPagination
              products={products}
              paginationConfig={{ count, offset, limit }}
              context={`categories/${category.handle}`}
            />
          ) : (
            <div className="text-gray-500 italic">No products available.</div>
          )}
        </div>
      </div>
    </Container>
  );
}
