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

      <div className="mt-12 w-full">
        {parentCategories.map((parent) => (
          <section key={parent.id} className="mb-12">
            <NavLink
              to={`/categories/${parent.handle}`}
              className={({ isActive }) =>
                [
                  'text-2xl font-bold mb-4 inline-block transition-colors',
                  isActive ? 'text-primary' : 'text-gray-900 hover:text-primary cursor-pointer',
                ].join(' ')
              }
              prefetch="viewport"
            >
              {parent.name}
            </NavLink>
            {parent.category_children?.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
                {parent.category_children.map((child) => (
                  <NavLink
                    key={child.id}
                    to={`/categories/${child.handle}`}
                    className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow w-full"
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
            ) : (
              <div className="text-gray-500 italic">No subcategories available.</div>
            )}
          </section>
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
