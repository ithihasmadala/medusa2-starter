import { ProductReviewSection } from '@app/components/reviews/ProductReviewSection';
import RelatedProductList from '@app/components/sections/RelatedProductList';
import { ProductTemplate } from '@app/templates/ProductTemplate';
import { getMergedProductMeta } from '@libs/util/products';
import { fetchProductReviewStats, fetchProductReviews } from '@libs/util/server/data/product-reviews.server';
import { fetchProducts } from '@libs/util/server/products.server';
import { withPaginationParams } from '@libs/util/withPaginationParams';
import { type LoaderFunctionArgs, type MetaFunction, redirect } from 'react-router';
import { useLoaderData } from 'react-router';

export const loader = async (args: LoaderFunctionArgs) => {
  const { limit: reviewsLimit, offset: reviewsOffset } = withPaginationParams({
    request: args.request,
    defaultPageSize: 5,
  });

  const { products } = await fetchProducts(args.request, {
    handle: args.params.productHandle,
    fields: '*categories,*tags,*collection',
  });

  if (!products.length) throw redirect('/404');

  const product = products[0];

  // Fetch related products based on tags, categories, and collection
  const relatedProductsQueries = [];

  // Get products from same collection (highest priority)
  if (product.collection?.id) {
    relatedProductsQueries.push(
      fetchProducts(args.request, {
        collection_id: product.collection.id,
        limit: 8,
        fields: 'id,title,handle,thumbnail,variants.*,variants.prices.*',
      }),
    );
  }

  // Get products from same categories
  if (product.categories?.length) {
    const categoryIds = product.categories.map((cat) => cat.id);
    relatedProductsQueries.push(
      fetchProducts(args.request, {
        category_id: categoryIds,
        limit: 8,
        fields: 'id,title,handle,thumbnail,variants.*,variants.prices.*',
      }),
    );
  }

  // Get products with same tags
  if (product.tags?.length) {
    const tagIds = product.tags.map((tag) => tag.id);
    relatedProductsQueries.push(
      fetchProducts(args.request, {
        tag_id: tagIds,
        limit: 8,
        fields: 'id,title,handle,thumbnail,variants.*,variants.prices.*',
      }),
    );
  }

  // Execute all related product queries
  const relatedProductsResults = await Promise.all(relatedProductsQueries);

  // Combine and deduplicate related products
  const allRelatedProducts = relatedProductsResults.flatMap((result) => result.products);
  const uniqueRelatedProducts = Array.from(new Map(allRelatedProducts.map((p) => [p.id, p])).values()).filter(
    (p) => p.id !== product.id,
  ); // Exclude current product

  // Prioritize products: collection first, then categories, then tags
  const relatedProducts = uniqueRelatedProducts.slice(0, 12);

  // Reviews plugin needs configuration - temporarily disabled
  // const [productReviews, productReviewStats] = await Promise.all([
  //   fetchProductReviews({
  //     product_id: product.id,
  //     fields:
  //       'id,rating,content,name,images.url,created_at,updated_at,response.content,response.created_at,response.id',
  //     order: 'created_at',
  //     status: ['approved'],
  //     // can use status: (pending, approved, flagged)[] to get reviews by status // default is approved
  //     offset: reviewsOffset,
  //     limit: reviewsLimit,
  //   }),
  //   fetchProductReviewStats({
  //     product_id: product.id,
  //     offset: 0,
  //     limit: 1,
  //   }),
  // ]);

  // Mock empty reviews data
  const productReviews = { count: 0, product_reviews: [] };
  const productReviewStats = { product_review_stats: [null] };

  return { product, productReviews, productReviewStats, relatedProducts };
};

export type ProductPageLoaderData = typeof loader;

export const meta: MetaFunction<ProductPageLoaderData> = getMergedProductMeta;

export default function ProductDetailRoute() {
  const { product, productReviews, productReviewStats, relatedProducts } = useLoaderData<ProductPageLoaderData>();

  return (
    <>
      <ProductTemplate
        product={product}
        reviewsCount={productReviews.count}
        reviewStats={productReviewStats.product_review_stats[0] || undefined}
      />
      <RelatedProductList className="!pb-[100px] xl:px-9" heading="You may also like" products={relatedProducts} />
      <ProductReviewSection />
    </>
  );
}
