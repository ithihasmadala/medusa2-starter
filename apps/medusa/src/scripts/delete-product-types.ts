import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

async function deleteProductTypes({ container }: ExecArgs) {
  console.log('🗑️ Starting to delete all product types...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Get all existing product types
    const existingProductTypes = await productModuleService.listProductTypes({});

    console.log(`Found ${existingProductTypes.length} product types to delete`);

    if (existingProductTypes.length === 0) {
      console.log('No product types found to delete');
      return;
    }

    // Delete all product types
    for (const productType of existingProductTypes) {
      try {
        await productModuleService.deleteProductTypes(productType.id);
        console.log(`✅ Deleted product type: ${productType.value}`);
      } catch (error) {
        console.log(`⚠️ Could not delete product type "${productType.value}":`, error.message);
      }
    }

    console.log('🎉 All product types deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting product types:', error);
    throw error;
  }
}

export default deleteProductTypes;
