import { LogoStoreName } from '@app/components/LogoStoreName/LogoStoreName';
import { Container } from '@app/components/common/container/Container';
import { Select } from '@app/components/common/forms/inputs/Select';
import { URLAwareNavLink } from '@app/components/common/link/URLAwareNavLink';
import { NewsletterSubscription } from '@app/components/newsletter/Newsletter';
import { SearchInput } from '@app/components/layout/header/SearchInput';
import { useRegion } from '@app/hooks/useRegion';
import { useRegions } from '@app/hooks/useRegions';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { convertToFormData } from '@libs/util/forms/objectToFormData';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useFetcher } from 'react-router';
import { StripeSecurityImage } from '../../images/StripeSecurityImage';
import { SocialIcons } from './SocialIcons';

export const Footer = () => {
  const { footerNavigationItems, settings } = useSiteDetails();
  const rootData = useRootLoaderData();
  const hasProducts = rootData?.hasPublishedProducts;
  const categories = rootData?.categories || [];
  const collections = rootData?.collections || [];
  const fetcher = useFetcher();
  const { regions } = useRegions();
  const { region } = useRegion();

  const regionOptions = useMemo(() => {
    return regions.map((region) => ({
      label: `${region.name} (${region.currency_code})`,
      value: region.id,
    }));
  }, [regions]);

  const onRegionChange = (regionId: string) => {
    fetcher.submit(
      convertToFormData({
        regionId,
      }),
      { method: 'post', action: '/api/region' },
    );
  };

  const parentCategories = categories.filter((cat) => !cat.parent_category_id);

  return (
    <footer className="bg-accent-50 min-h-[140px] py-8 text-white">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 w-full flex-col items-start gap-8 sm:flex-row sm:gap-16">
          <div className="flex w-full flex-col items-center gap-8 sm:w-auto sm:items-start sm:gap-9 sm:col-span-2 lg:col-span-2">
            <div className="flex flex-col gap-5">
              <h4 className="font-bold">Premium Research Peptides</h4>
              <p className="text-sm">
                Your trusted source for high-quality research peptides and pharmaceutical compounds. We offer premium
                products from leading manufacturers including Adelphi Research, Rohm Labs, Hilma Biocare, and Optimum
                Biotech. All products are for research purposes only and meet the highest quality standards.
              </p>
            </div>
            <LogoStoreName />

            <div className="w-full max-w-sm sm:max-w-none sm:w-auto">
              <h5 className="font-bold mb-3 text-center sm:text-left">Quick Search</h5>
              <div className="flex justify-center sm:justify-start">
                <SearchInput variant="footer" placeholder="Search products..." className="w-full max-w-xs" />
              </div>
            </div>
          </div>

          {/* Shop Navigation - Consolidated */}
          <nav className="pt-2 lg:col-span-2">
            <h5 className="font-bold mb-4">Shop</h5>

            {/* Shop All */}
            <URLAwareNavLink
              url="/products"
              className="hover:text-slate-200 block pb-2 text-sm font-medium"
              prefetch="viewport"
            >
              Shop All
            </URLAwareNavLink>

            {/* Categories Subsection */}
            {parentCategories.length > 0 && (
              <div className="mt-4">
                <h6 className="font-semibold mb-2 text-sm text-slate-300">By Category</h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {parentCategories.slice(0, 6).map((category) => (
                    <URLAwareNavLink
                      key={category.id}
                      url={`/categories/${category.handle}`}
                      className="hover:text-slate-200 block pb-1 text-sm pl-2"
                      prefetch="viewport"
                    >
                      {category.name}
                    </URLAwareNavLink>
                  ))}
                </div>
                {parentCategories.length > 6 && (
                  <URLAwareNavLink
                    url="/categories"
                    className="hover:text-slate-200 block pt-2 text-sm font-medium pl-2"
                    prefetch="viewport"
                  >
                    View All Categories →
                  </URLAwareNavLink>
                )}
              </div>
            )}
          </nav>

          <div className="flex flex-col gap-5 lg:col-span-1">
            <NewsletterSubscription className="mb-4" />

            <SocialIcons siteSettings={settings} />

            <div className="flex flex-col gap-4 mt-4">
              <h5>Important Notice</h5>
              <p className="text-sm">
                All products are for research purposes only.
                <br />
                Not for human consumption or therapeutic use.
                <br />
                Must be 18+ to purchase.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-md:items-center gap-8 mt-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2 ">
              <Select
                className="!text-base border-1 border-white text-white bg-transparent !shadow-none"
                options={regionOptions}
                defaultValue={region?.id}
                onChange={(e) => {
                  onRegionChange(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mt-1 flex flex-col justify-end text-xs sm:mt-0">
            {hasProducts && <StripeSecurityImage className="mt-2" />}
          </div>
        </div>
      </Container>
    </footer>
  );
};
