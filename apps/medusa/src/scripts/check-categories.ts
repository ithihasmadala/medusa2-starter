import type { ExecArgs } from '@medusajs/types';

async function checkCategories({ container }: ExecArgs) {
  console.log('🔍 Checking category structure...');

  try {
    const productService = container.resolve('product');

    // Get all categories
    console.log('\n📂 Raw category data:');
    const categories = await productService.listProductCategories({});

    categories.forEach((cat, index) => {
      console.log(`${index + 1}. Category ID: ${cat.id}`);
      console.log(`   Name: "${cat.name || 'NULL'}"`);
      console.log(`   Handle: "${cat.handle || 'NULL'}"`);
      console.log(`   Full object:`, JSON.stringify(cat, null, 2));
      console.log('   ---');
    });

    // Try to get specific categories by different methods
    console.log('\n🔍 Trying to find specific categories...');
    try {
      // Try to search for specific categories
      const searchResults = await productService.listProductCategories({
        name: 'adelphi anavar',
      });
      console.log('Search for "adelphi anavar":', searchResults.length);
    } catch (e) {
      console.log('Search failed:', e.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export default checkCategories;
