import { ActionList } from '@app/components/common/actions-list/ActionList';
import { Container } from '@app/components/common/container';
import { Image } from '@app/components/common/images/Image';
import { GridCTA } from '@app/components/sections/GridCTA';
import Hero from '@app/components/sections/Hero';
import { ListItems } from '@app/components/sections/ListItems';
import ProductList from '@app/components/sections/ProductList';
import { SideBySide } from '@app/components/sections/SideBySide';
import { SearchInput } from '@app/components/layout/header/SearchInput';
import { getMergedPageMeta } from '@libs/util/page';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export const loader = async (args: LoaderFunctionArgs) => {
  return {};
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

export default function IndexRoute() {
  return (
    <>
      <link rel="preload" href="/assets/images/barrio-banner.png" as="image" />
      <Hero
        className="h-[600px] sm:h-[700px] md:h-[800px] !max-w-full -mt-[calc(var(--mkt-header-height)+3rem)] md:-mt-[calc(var(--mkt-header-height-desktop)+2rem)] pt-[var(--mkt-header-height)] md:pt-[var(--mkt-header-height-desktop)]"
        content={
          <div className="text-center w-full space-y-6 sm:space-y-8 md:space-y-9 px-4">
            <h4 className="font-italiana text-lg sm:text-xl md:text-2xl">HEALTH & WELLNESS</h4>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-aboreto leading-tight">
              BUY RETATRUTIDE UK
            </h1>
            <p className="max-w-prose mx-auto text-base sm:text-lg px-4">
              Discover premium Retatrutide, sourced with care and delivered to your door. At Buy Retatrutide UK, we're
              more than a supplier—we're your trusted health partner.
            </p>
            <div className="flex justify-center mt-6 sm:mt-8 px-4">
              <SearchInput
                variant="hero"
                className="w-full max-w-sm sm:max-w-md"
                placeholder="Search for products..."
              />
            </div>
          </div>
        }
        image={{
          url: '/assets/images/barrio-banner.png',
          alt: 'Buy Retatrutide UK background',
        }}
      />

      <Container className="p-6 sm:p-8 md:p-14 md:pt-1 lg:pt-24 relative flex flex-col-reverse items-center lg:flex-row">
        <div className="w-60 sm:w-72 md:w-80 md:absolute md:left-4 md:-top-[200px] lg:-top-[240px] lg:left-20 lg:w-[420px]">
          <Image
            src="/assets/images/header-image-1.png"
            loading="lazy"
            alt="Buy Retatrutide UK background"
            height={520}
            width={420}
            className="w-full h-auto"
          />
        </div>

        <div className="w-full flex flex-col justify-center items-center lg:items-start">
          <div className="w-full flex text-center md:text-left">
            <h2 className="mx-auto md:ml-[32%] lg:ml-[37%] xl:ml-[30%] lg:mr-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-ballet mt-8 sm:mt-10 md:mt-12 leading-tight">
              Supporting Wellness
            </h2>
          </div>
          <p className="font-italiana text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mt-4 sm:mt-6 lg:mt-8 xl:mt-10 text-center lg:text-left leading-tight">
            one step at a time
          </p>
        </div>
      </Container>

      <Container className="p-6 sm:p-8 md:p-14 pt-4 sm:pt-6 md:pt-0">
        <Hero
          className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[594px]"
          backgroundClassName="rounded-2xl sm:rounded-3xl"
          image={{
            url: '/assets/images/banner-coffee-shop.png',
            alt: 'Buy Retatrutide UK background',
          }}
        />
      </Container>

      <ListItems
        itemsClassName="mb-2"
        title="About our products"
        items={[
          {
            title: 'Premium Quality',
            description:
              'We believe good health happens when great products come together with trusted suppliers and quality assurance.',
            image: {
              src: '/assets/images/benefit-1.png',
              alt: 'Premium Quality',
              width: 60,
              height: 60,
            },
          },
          {
            title: 'Carefully Sourced',
            description:
              'Our products are sourced from reputable suppliers and undergo rigorous quality checks to ensure safety and efficacy.',
            image: {
              src: '/assets/images/benefit-2.png',
              alt: 'Carefully Sourced',
              width: 60,
              height: 60,
            },
          },
          {
            title: 'Customer Support',
            description: 'Every purchase comes with dedicated customer support to help you on your wellness journey.',
            image: {
              src: '/assets/images/benefit-3.png',
              alt: 'Customer Support',
              width: 60,
              height: 60,
            },
          },
        ]}
      />

      <ProductList
        className="!pb-[60px] sm:!pb-[80px] md:!pb-[100px]"
        heading="Our Products"
        actions={[
          {
            label: 'View all',
            url: '/products',
          },
        ]}
      />

      <Hero
        className="pb-8 sm:pb-10 min-h-[600px] sm:min-h-[650px] md:min-h-[734px] !max-w-full"
        content={
          <div className="text-center w-full space-y-6 sm:space-y-8 md:space-y-9 pt-6 sm:pt-8 md:pt-9 px-4">
            <h4 className="font-italiana text-lg sm:text-xl md:text-2xl">SUBSCRIBE & SAVE</h4>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-italiana leading-tight px-2">
              Sit back, let us take care&nbsp;of&nbsp;your&nbsp;wellness
            </h1>

            <ListItems
              className="text-left w-full text-black justify-between p-0"
              itemsClassName="rounded-2xl sm:rounded-3xl bg-highlight-900 p-6 sm:p-8 md:p-10 text-sm"
              useFillTitle
              items={[
                {
                  title: 'Choose your product',
                  description:
                    'From our premium Retatrutide to specialized formulations, we have the products to fit your wellness goals.',
                },
                {
                  title: 'Choose a frequency',
                  description:
                    'Receive your products weekly, every 2 weeks, every 3 weeks, or monthly—whatever frequency meets your needs.',
                },
                {
                  title: 'enjoy :)',
                  description:
                    "You've chosen your products and delivery schedule—all that's left to do is sit back and focus on your wellness journey.",
                },
              ]}
            />

            <div className="flex justify-center mt-6 sm:mt-8">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg text-gray-900 font-medium text-base sm:text-lg hover:bg-white hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Shop All Products
              </a>
            </div>
          </div>
        }
        image={{
          url: '/assets/images/barrio-banner.png',
          alt: 'Wellness subscription service background',
        }}
      />
    </>
  );
}
