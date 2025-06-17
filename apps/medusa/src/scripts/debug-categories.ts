import type { ExecArgs } from '@medusajs/types';

async function debugCategories({ container }: ExecArgs) {
  console.log('🔍 Debugging categories and collections...');

  try {
    // Get services
    const productService = container.resolve('product');

    // Get categories
    console.log('\n📂 Categories:');
    const categories = await productService.listProductCategories({});
    console.log(`Found ${categories.length} categories:`);
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (handle: ${cat.handle}, id: ${cat.id})`);
    });

    // Get collections
    console.log('\n📦 Collections:');
    const collections = await productService.listProductCollections({});
    console.log(`Found ${collections.length} collections:`);
    collections.forEach((coll, index) => {
      console.log(`${index + 1}. ${coll.title} (handle: ${coll.handle}, id: ${coll.id})`);
    });

    // Get a sample of products to see their current state
    console.log('\n🛍️ Sample products (first 5):');
    const products = await productService.listProducts({
      take: 5,
      relations: ['categories', 'collection', 'tags'],
    });

    products.forEach((product, index) => {
      console.log(`${index + 1}. "${product.title}"`);
      console.log(
        `   Collection: ${product.collection?.title || 'None'} (${product.collection?.handle || 'no-handle'})`,
      );
      console.log(`   Categories: ${product.categories?.map((c) => c.name).join(', ') || 'None'}`);
      console.log(`   Tags: ${product.tags?.map((t) => t.value).join(', ') || 'None'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

export default debugCategories;
