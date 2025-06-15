import { Container } from '@app/components/common/container';
import Hero from '@app/components/sections/Hero';
import { getMergedPageMeta } from '@libs/util/page';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export const loader = async (args: LoaderFunctionArgs) => {
  return {};
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

const values = [
  {
    title: 'Quality Assurance',
    description:
      'Every product undergoes rigorous testing and quality control to ensure the highest standards of purity and potency.',
    icon: '🔬',
  },
  {
    title: 'Scientific Excellence',
    description:
      'Our team of experts stays at the forefront of peptide research to provide cutting-edge compounds for your studies.',
    icon: '⚗️',
  },
  {
    title: 'Regulatory Compliance',
    description: 'We maintain strict adherence to all regulatory guidelines and industry best practices.',
    icon: '📋',
  },
  {
    title: 'Customer Support',
    description: 'Our knowledgeable team provides comprehensive support to help you achieve your research goals.',
    icon: '🤝',
  },
];

const ValueCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default function IndexRoute() {
  return (
    <>
      <Container className="!px-0 py-0 sm:!p-16">
        <Hero
          className="min-h-[500px] !max-w-full bg-gradient-to-br from-amber-50 to-orange-100 sm:rounded-3xl p-6 sm:p-10 md:p-[88px] md:px-[88px]"
          content={
            <div className="text-center w-full space-y-9">
              <h4 className="text-lg md:text-2xl font-semibold tracking-wider text-amber-800">ABOUT US</h4>
              <h1 className="text-4xl md:text-7xl font-bold tracking-wider text-gray-900">Our Story</h1>
              <p className="mx-auto text-md md:text-xl !leading-relaxed max-w-4xl text-gray-700">
                We are a leading provider of premium research peptides, dedicated to advancing scientific discovery and
                innovation. Founded by researchers for researchers, our company was built on the principle that
                high-quality compounds are essential for meaningful scientific progress. We specialize in providing
                pharmaceutical-grade peptides from trusted manufacturers like{' '}
                <span className="font-bold text-amber-800">Adelphi Research</span>,{' '}
                <span className="font-bold text-amber-800">Rohm Labs</span>, and other industry leaders.
              </p>
            </div>
          }
          actionsClassName="!flex-row w-full justify-center !font-base gap-4"
          actions={[
            {
              label: 'Shop All Products',
              url: '/products',
            },
            {
              label: 'Browse by Category',
              url: '/categories',
            },
          ]}
        />
      </Container>

      <Container className="pt-16 pb-16 sm:!px-16">
        <div className="max-w-6xl mx-auto">
          {/* Mission Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              To provide researchers worldwide with access to the highest quality peptides and compounds, enabling
              breakthrough discoveries that advance human health and scientific understanding. We are committed to
              supporting the research community with reliable products, expert knowledge, and exceptional service.
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <ValueCard key={index} {...value} />
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Trusted Partnerships</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We work exclusively with reputable manufacturers and suppliers who share our commitment to quality and
                  scientific integrity. Our partnerships with industry leaders ensure consistent access to premium
                  compounds.
                </p>

                <h3 className="text-xl font-bold mb-4 text-gray-900">Research Focus</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every product in our catalog is selected specifically for research applications. We understand the
                  unique requirements of scientific research and curate our inventory accordingly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Quality Guarantee</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  All products come with certificates of analysis and are backed by our quality guarantee. We stand
                  behind every compound we sell with comprehensive testing and documentation.
                </p>

                <h3 className="text-xl font-bold mb-4 text-gray-900">Expert Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team includes experienced researchers and industry professionals who can provide technical
                  guidance and support for your research projects.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Important Notice:</strong> All products are intended for research purposes only. Not for human
              consumption or therapeutic use. Please ensure compliance with all applicable laws and regulations in your
              jurisdiction.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
