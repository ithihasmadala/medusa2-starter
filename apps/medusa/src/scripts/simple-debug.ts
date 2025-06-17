import type { ExecArgs } from '@medusajs/types';

async function simpleDebug({ container }: ExecArgs) {
  console.log('🔍 Simple debugging...');

  try {
    const productService = container.resolve('product');

    // Get categories with minimal info
    const categories = await productService.listProductCategories({});
    console.log(`\n📂 Found ${categories.length} categories`);

    // Get collections with minimal info
    const collections = await productService.listProductCollections({});
    console.log(`📦 Found ${collections.length} collections`);

    // Check first collection
    if (collections.length > 0) {
      console.log('\nFirst collection:', JSON.stringify(collections[0], null, 2));
    }

    // Check first category
    if (categories.length > 0) {
      console.log('\nFirst category:', JSON.stringify(categories[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

export default simpleDebug;
