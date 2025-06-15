import { Container } from '@app/components/common/container/Container';
import ProductCarousel from '@app/components/product/ProductCarousel';
import { ProductListHeader } from '@app/components/product/ProductListHeader';
import type { CustomAction } from '@libs/types';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { type FC, HTMLAttributes, memo } from 'react';

export interface RelatedProductListProps<TElement extends HTMLElement = HTMLDivElement>
  extends HTMLAttributes<TElement> {
  heading?: string;
  text?: string;
  actions?: CustomAction[];
  className?: string;
  products: StoreProduct[];
}

const RelatedProductListBase: FC<{ products: StoreProduct[] }> = ({ products }) => {
  const hasProducts = !products?.length;

  return (
    <>
      {hasProducts && (
        <div className="mb-8 mt-8">
          <h3 className="text-lg font-bold text-gray-900">No related products found.</h3>
        </div>
      )}

      {!hasProducts && <ProductCarousel products={products} />}
    </>
  );
};

export const RelatedProductList: FC<RelatedProductListProps> = memo(
  ({ className, heading, text, actions, products, ...props }) => {
    // Don't render if no products
    if (!products?.length) {
      return null;
    }

    return (
      <section className={clsx(`mkt-section relative overflow-x-hidden`, className)} {...props}>
        <div className="mkt-section__inner relative z-[2]">
          <Container>
            <ProductListHeader heading={heading} text={text} actions={actions} />
            <RelatedProductListBase products={products} />
          </Container>
        </div>
      </section>
    );
  },
);

export default RelatedProductList;
