import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

async function deleteCategories({ container }: ExecArgs) {
  console.log('🗑️ Starting to delete all categories...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Get all existing categories
    const existingCategories = await productModuleService.listProductCategories({});

    console.log(`Found ${existingCategories.length} categories to delete`);

    if (existingCategories.length === 0) {
      console.log('No categories found to delete');
      return;
    }

    // Delete all categories
    for (const category of existingCategories) {
      try {
        await productModuleService.deleteProductCategories(category.id);
        console.log(`✅ Deleted category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Could not delete category "${category.name}":`, error.message);
      }
    }

    console.log('🎉 All categories deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting categories:', error);
    throw error;
  }
}

export default deleteCategories;
