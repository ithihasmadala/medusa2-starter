import type { ExecArgs } from '@medusajs/types';

async function fetchCategories({ container }: ExecArgs) {
  console.log('🔍 Fetching all categories with proper Medusa v2 query...');

  try {
    const productService = container.resolve('product');

    // Try using retrieveProductCategory for each ID
    console.log('\n1. First, get basic category list:');
    const categories = await productService.listProductCategories({});
    console.log(`Found ${categories.length} categories`);

    // Now retrieve each category individually to get full data
    console.log('\n2. Retrieving individual categories with full data:');

    for (let i = 0; i < Math.min(5, categories.length); i++) {
      const categoryId = categories[i].id;
      console.log(`\nRetrieving category ${i + 1}: ${categoryId}`);

      try {
        const fullCategory = await productService.retrieveProductCategory(categoryId);
        console.log(`   Name: "${fullCategory.name || 'NULL'}"`);
        console.log(`   Handle: "${fullCategory.handle || 'NULL'}"`);
        console.log(`   ID: ${fullCategory.id}`);
        console.log(`   Raw data:`, JSON.stringify(fullCategory, null, 2));
      } catch (err) {
        console.log(`   Error retrieving category: ${err.message}`);
      }
    }

    // Try a different approach - using query with relations
    console.log('\n3. Trying with query approach:');
    try {
      const query = await productService.listProductCategories({}, { take: 5 });
      console.log('Query result:', query);
    } catch (err) {
      console.log('Query approach failed:', err.message);
    }
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
  }
}

export default fetchCategories;
