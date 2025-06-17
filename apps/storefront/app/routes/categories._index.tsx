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

  // Get parent categories
  const parentCategories = categories.filter((cat) => !cat.parent_category_id);

  return (
    <Container className="pb-16">
      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 font-normal lg:font-normal">
        Shop by Category
      </PageHeading>

      <div className="mt-12 space-y-12">
        {parentCategories.map((parent) => (
          <div key={parent.id}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{parent.name}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {/* Render parent as a card too */}
              <NavLink
                key={parent.id}
                to={`/categories/${parent.handle}`}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
                prefetch="viewport"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {parent.name}
                  </h3>
                  {parent.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{parent.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">Explore →</span>
                  </div>
                </div>
              </NavLink>
              {/* Render subcategories as indented cards */}
              {parent.category_children?.map((child) => (
                <NavLink
                  key={child.id}
                  to={`/categories/${child.handle}`}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow ml-4"
                  prefetch="viewport"
                >
                  <div className="p-6">
                    <h3 className="text-base font-medium text-gray-800 group-hover:text-primary-600 transition-colors">
                      {child.name}
                    </h3>
                    {child.description && (
                      <p className="mt-2 text-xs text-gray-600 line-clamp-2">{child.description}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-primary-600 group-hover:text-primary-700">
                        Explore →
                      </span>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
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
