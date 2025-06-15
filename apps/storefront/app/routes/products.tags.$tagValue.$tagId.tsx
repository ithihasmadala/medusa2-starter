import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { PageHeading } from '@app/components/sections/PageHeading';
import { fetchProducts } from '@libs/util/server/products.server';
import { withPaginationParams } from '@libs/util/withPaginationParams';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { useLoaderData } from 'react-router';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tagValue = params.tagValue as string;
  const tagId = params.tagId as string;

  if (!tagValue || !tagId) {
    throw redirect('/products');
  }

  const { limit, offset } = withPaginationParams({
    request,
    defaultPageSize: 12,
  });

  const { products, count } = await fetchProducts(request, {
    tag_id: [tagId],
    limit,
    offset,
  });

  return {
    products,
    count,
    limit,
    offset,
    tagValue: decodeURIComponent(tagValue),
    tagId,
  };
};

type ProductTagRouteLoader = typeof loader;

export default function ProductTagRoute() {
  const data = useLoaderData<ProductTagRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, tagValue } = data;

  return (
    <Container className="pb-16">
      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 mb-12 font-normal lg:font-normal">
        Products tagged with "{tagValue}"
      </PageHeading>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <ProductListWithPagination
            products={products}
            paginationConfig={{ count, offset, limit }}
            context={`products/tags/${encodeURIComponent(tagValue)}/${data.tagId}`}
          />
        </div>
      </div>
    </Container>
  );
}
