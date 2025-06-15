import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

async function deleteCollections({ container }: ExecArgs) {
  console.log('🗑️ Starting to delete all collections...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Get all existing collections
    const existingCollections = await productModuleService.listProductCollections({});

    console.log(`Found ${existingCollections.length} collections to delete`);

    if (existingCollections.length === 0) {
      console.log('No collections found to delete');
      return;
    }

    // Delete all collections
    for (const collection of existingCollections) {
      try {
        await productModuleService.deleteProductCollections(collection.id);
        console.log(`✅ Deleted collection: ${collection.title}`);
      } catch (error) {
        console.log(`⚠️ Could not delete collection "${collection.title}":`, error.message);
      }
    }

    console.log('🎉 All collections deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting collections:', error);
    throw error;
  }
}

export default deleteCollections;
