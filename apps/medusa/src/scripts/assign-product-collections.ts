import type { ExecArgs } from '@medusajs/framework/types';
import { updateProductsWorkflow } from '@medusajs/core-flows';

export default async function assignProductCollections({ container }: ExecArgs) {
  console.log('🚀 Assigning collections to Adelphi and Rohm products...');

  const productService = container.resolve('product');

  // 1. Get all collections
  const collections = await productService.listProductCollections({});
  const adelphiCollection = collections.find((c) => c.title.toLowerCase() === 'adelphi research');
  const rohmCollection = collections.find((c) => c.title.toLowerCase() === 'rohm labs');

  if (!adelphiCollection || !rohmCollection) {
    throw new Error('Could not find both Adelphi Research and Rohm Labs collections');
  }

  // 2. Get all products
  const allProducts = await productService.listProducts({}, { limit: 1000 });

  let adelphiCount = 0;
  let rohmCount = 0;
  for (const product of allProducts) {
    const title = product.title.toLowerCase();
    const handle = product.handle.toLowerCase();
    let newCollectionId = null;

    if (title.includes('adelphi') || handle.includes('adelphi')) {
      if (product.collection_id === adelphiCollection.id) continue;
      newCollectionId = adelphiCollection.id;
    } else if (title.includes('rohm') || handle.includes('rohm')) {
      if (product.collection_id === rohmCollection.id) continue;
      newCollectionId = rohmCollection.id;
    } else {
      continue;
    }

    const workflow = updateProductsWorkflow(container);
    await workflow.run({
      input: {
        products: [
          {
            id: product.id,
            collection_id: newCollectionId,
          },
        ],
      },
    });

    if (newCollectionId === adelphiCollection.id) {
      adelphiCount++;
      console.log(`✅ Assigned Adelphi Research to ${product.title} (${product.id})`);
    } else if (newCollectionId === rohmCollection.id) {
      rohmCount++;
      console.log(`✅ Assigned Rohm Labs to ${product.title} (${product.id})`);
    }
  }

  console.log(
    `🎉 Done! ${adelphiCount} Adelphi products and ${rohmCount} Rohm products assigned to their collections.`,
  );
}
