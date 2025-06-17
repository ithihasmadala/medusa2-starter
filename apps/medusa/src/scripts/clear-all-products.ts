import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

export default async function clearAllProducts({ container }: ExecArgs) {
  console.log('🧹 Starting to clear all products from database...');

  try {
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Get all products
    const { products } = await productModuleService.listProducts(
      {},
      {
        select: ['id', 'title'],
        take: 1000, // Get up to 1000 products
      },
    );

    console.log(`📦 Found ${products.length} products to delete`);

    if (products.length === 0) {
      console.log('✅ No products found - database is already clean');
      return;
    }

    // Delete products in batches
    const batchSize = 10;
    let deleted = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const productIds = batch.map((p) => p.id);

      try {
        console.log(
          `🗑️  Deleting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)} (${batch.length} products)`,
        );

        await productModuleService.deleteProducts(productIds);
        deleted += batch.length;

        console.log(`✅ Deleted ${batch.length} products (${deleted}/${products.length} total)`);
      } catch (error) {
        console.error(`❌ Error deleting batch:`, error.message);
      }
    }

    console.log(`🎉 Successfully deleted ${deleted} products`);
    console.log('✅ Database is now clean and ready for fresh import');
  } catch (error) {
    console.error('❌ Error clearing products:', error);
    throw error;
  }
}
