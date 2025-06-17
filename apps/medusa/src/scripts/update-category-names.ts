import type { ExecArgs } from '@medusajs/types';

async function updateCategoryNames({ container }: ExecArgs) {
  console.log('🏷️ Updating category names and handles...');

  try {
    const productService = container.resolve('product');

    // Get all existing categories
    const categories = await productService.listProductCategories({});
    console.log(`Found ${categories.length} categories to update`);

    // Define the categories we want to create
    const categoryDefinitions = [
      { name: 'Adelphi Research', handle: 'adelphi-research' },
      { name: 'adelphi anavar', handle: 'adelphi-anavar' },
      { name: 'adelphi orals', handle: 'adelphi-orals' },
      { name: 'adelphi test', handle: 'adelphi-test' },
      { name: 'adelphi injectables', handle: 'adelphi-injectables' },
      { name: 'Rohm Labs', handle: 'rohm-labs' },
      { name: 'rohm anavar', handle: 'rohm-anavar' },
      { name: 'rohm orals', handle: 'rohm-orals' },
      { name: 'rohm test', handle: 'rohm-test' },
      { name: 'rohm injectables', handle: 'rohm-injectables' },
    ];

    // Update the first N categories with our names
    for (let i = 0; i < Math.min(categories.length, categoryDefinitions.length); i++) {
      const category = categories[i];
      const definition = categoryDefinitions[i];

      console.log(`Updating category ${i + 1}: ${category.id} -> "${definition.name}"`);

      try {
        await productService.updateProductCategories(category.id, {
          name: definition.name,
          handle: definition.handle,
        });
        console.log(`✅ Updated: ${definition.name}`);
      } catch (error) {
        console.error(`❌ Failed to update ${definition.name}:`, error.message);
      }
    }

    // If we need more categories, create them
    if (categoryDefinitions.length > categories.length) {
      const remaining = categoryDefinitions.slice(categories.length);
      console.log(`\n📦 Creating ${remaining.length} additional categories...`);

      for (const definition of remaining) {
        try {
          const newCategory = await productService.createProductCategories({
            name: definition.name,
            handle: definition.handle,
          });
          console.log(`✅ Created: ${definition.name} (${newCategory.id})`);
        } catch (error) {
          console.error(`❌ Failed to create ${definition.name}:`, error.message);
        }
      }
    }

    console.log('\n🔍 Verifying updated categories...');
    const updatedCategories = await productService.listProductCategories({});
    updatedCategories.forEach((cat, index) => {
      console.log(`${index + 1}. "${cat.name}" (handle: ${cat.handle}, id: ${cat.id})`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

export default updateCategoryNames;
