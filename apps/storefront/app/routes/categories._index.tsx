import { Container } from '@app/components/common/container';
import { PageHeading } from '@app/components/sections/PageHeading';
import { listCategories } from '@libs/util/server/data/categories.server';
import { LoaderFunctionArgs } from 'react-router';
import { NavLink, useLoaderData } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const categories = await listCategories();

  return {
    categories,
  };
};

export type CategoriesIndexRouteLoader = typeof loader;

export default function CategoriesIndexRoute() {
  const data = useLoaderData<CategoriesIndexRouteLoader>();

  if (!data) return null;

  const { categories } = data;

  return (
    <Container className="pb-16">
      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 font-normal lg:font-normal">
        Shop by Category
      </PageHeading>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12">
        {categories.map((category) => (
          <NavLink
            key={category.id}
            to={`/categories/${category.handle}`}
            className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
            prefetch="viewport"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{category.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">Explore →</span>
              </div>
            </div>
          </NavLink>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories available at the moment.</p>
        </div>
      )}
    </Container>
  );
}
