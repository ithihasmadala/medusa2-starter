import { Container } from '@app/components/common/container';
import { PageHeading } from '@app/components/sections/PageHeading';
import { fetchCollections } from '@libs/util/server/data/collections.server';
import { LoaderFunctionArgs } from 'react-router';
import { NavLink, useLoaderData } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const collectionsData = await fetchCollections();

  return {
    collections: collectionsData.collections,
  };
};

export type CollectionsIndexRouteLoader = typeof loader;

export default function CollectionsIndexRoute() {
  const data = useLoaderData<CollectionsIndexRouteLoader>();

  if (!data) return null;

  const { collections } = data;

  return (
    <Container className="pb-16">
      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 font-normal lg:font-normal">
        Shop by Collection
      </PageHeading>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12">
        {collections.map((collection) => (
          <NavLink
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
            prefetch="viewport"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {collection.title}
              </h3>
              {collection.metadata?.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{collection.metadata.description as string}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">Explore →</span>
              </div>
            </div>
          </NavLink>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No collections available at the moment.</p>
        </div>
      )}
    </Container>
  );
}
