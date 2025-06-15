import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { PageHeading } from '@app/components/sections/PageHeading';
import { SearchInput } from '@app/components/layout/header/SearchInput';
import { fetchProducts } from '@libs/util/server/products.server';
import { withPaginationParams } from '@libs/util/withPaginationParams';
import { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData, useSearchParams } from 'react-router';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query || '';
  const count = data?.count || 0;

  return [
    { title: query ? `Search results for "${query}" | Your Store` : 'Search | Your Store' },
    {
      name: 'description',
      content: query
        ? `Found ${count} products matching "${query}". Browse our search results.`
        : "Search our product catalog to find exactly what you're looking for.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  const { limit, offset } = withPaginationParams({
    request,
    defaultPageSize: 12,
  });

  // If no query, return empty results
  if (!query.trim()) {
    return {
      products: [],
      count: 0,
      limit,
      offset,
      query: '',
    };
  }

  const { products, count } = await fetchProducts(request, {
    q: query.trim(),
    limit,
    offset,
    fields: 'id,title,handle,thumbnail,description,variants.*,variants.prices.*',
  });

  return {
    products,
    count,
    limit,
    offset,
    query: query.trim(),
  };
};

export default function SearchPage() {
  const { products, count, limit, offset, query } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  const hasResults = products.length > 0;
  const hasQuery = query.length > 0;

  return (
    <Container className="py-8">
      {/* Mobile Search Input */}
      <div className="md:hidden mb-8">
        <SearchInput className="w-full" />
      </div>

      {/* Page Heading */}
      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 mb-12 font-normal lg:font-normal">
        {hasQuery ? `Search Results` : 'Search Products'}
      </PageHeading>

      {/* Search Query Display */}
      {hasQuery && (
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">
            {hasResults ? (
              <>
                Found <span className="font-semibold">{count}</span> result{count !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold">"{query}"</span>
              </>
            ) : (
              <>
                No results found for <span className="font-semibold">"{query}"</span>
              </>
            )}
          </p>
        </div>
      )}

      {/* Search Results */}
      {hasQuery && hasResults && (
        <ProductListWithPagination
          products={products}
          paginationConfig={{ count, offset, limit }}
          context={`search?q=${encodeURIComponent(query)}`}
        />
      )}

      {/* No Results Message */}
      {hasQuery && !hasResults && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse our categories to find what you're looking for.
            </p>
            <div className="space-y-4">
              <div className="flex justify-center">
                <SearchInput variant="hero" className="w-full max-w-sm" placeholder="Try a different search..." />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <a
                  href="/categories"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Browse Categories
                </a>
                <a
                  href="/collections"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Browse Collections
                </a>
                <a
                  href="/products"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  All Products
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Query Message */}
      {!hasQuery && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Start your search</h3>
            <p className="text-gray-600 mb-6">Enter a search term to find products in our catalog.</p>
            <div className="flex justify-center">
              <SearchInput variant="hero" className="w-full max-w-sm" placeholder="Search for products..." />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
