import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

interface CategoryMapping {
  collectionHandle: string;
  categoryHandle: string;
}

async function assignProductCategories({ container }: ExecArgs) {
  console.log('🏷️ Starting to assign categories to products...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Define collection to category mappings based on existing categories
    const categoryMappings: CategoryMapping[] = [
      // Adelphi Research products - map to existing categories
      { collectionHandle: 'adelphi-orals', categoryHandle: 'adelphi-orals' },
      { collectionHandle: 'adelphi-anavar', categoryHandle: 'adelphi-anavar' },
      { collectionHandle: 'adelphi-test', categoryHandle: 'adelphi-test' },
      { collectionHandle: 'adelphi-injectables', categoryHandle: 'adelphi-injectables' },
      // These don't exist in DB, so will fall back to parent category
      { collectionHandle: 'adelphi-pct', categoryHandle: 'adelphi-research' },
      { collectionHandle: 'adelphi-fat-burners', categoryHandle: 'adelphi-research' },

      // Rohm Labs products - map to existing categories
      { collectionHandle: 'rohm-orals', categoryHandle: 'rohm-orals' },
      { collectionHandle: 'rohm-anavar', categoryHandle: 'rohm-anavar' },
      { collectionHandle: 'rohm-test', categoryHandle: 'rohm-test' },
      { collectionHandle: 'rohm-injectables', categoryHandle: 'rohm-injectables' },
      // These don't exist in DB, so will fall back to parent category
      { collectionHandle: 'rohm-pct', categoryHandle: 'rohm-labs' },
      { collectionHandle: 'rohm-fat-burners', categoryHandle: 'rohm-labs' },
    ];

    // Get existing categories and build a map
    console.log('📂 Loading existing categories...');
    const existingCategories = await productModuleService.listProductCategories({});
    const categoryMap = new Map<string, string>();

    for (const category of existingCategories) {
      categoryMap.set(category.handle, category.id);
      console.log(`📋 Found existing category: ${category.name} (${category.handle})`);
    }

    // Get all products
    console.log('📦 Fetching all products...');
    const products = await productModuleService.listProducts({
      relations: ['categories', 'collection'],
    });

    console.log(`Found ${products.length} products to categorize`);

    let categorizedCount = 0;
    let skippedCount = 0;

    // Process each product
    for (const product of products) {
      try {
        // Skip if product already has categories
        if (product.categories && product.categories.length > 0) {
          console.log(`⏭️ Product "${product.title}" already has categories, skipping`);
          skippedCount++;
          continue;
        }

        let targetCategoryId: string | null = null;

        // Find appropriate category based on collection
        if (product.collection?.handle) {
          const mapping = categoryMappings.find((m) => m.collectionHandle === product.collection.handle);
          if (mapping && categoryMap.has(mapping.categoryHandle)) {
            targetCategoryId = categoryMap.get(mapping.categoryHandle)!;
            console.log(`🎯 Mapping collection "${product.collection.handle}" to category "${mapping.categoryHandle}"`);
          }
        }

        // Fallback: try to determine category from product tags or type
        if (!targetCategoryId && product.tags) {
          const tags = product.tags.map((tag) => tag.value?.toLowerCase() || '');

          // Check for brand-specific tags and existing categories
          if (tags.includes('adelphi')) {
            if (tags.includes('oxandrolone') || tags.includes('anavar')) {
              targetCategoryId = categoryMap.get('adelphi-anavar');
            } else if (tags.includes('oral') || tags.includes('tablets')) {
              targetCategoryId = categoryMap.get('adelphi-orals');
            } else if (tags.includes('injectable') || tags.includes('intramuscular')) {
              targetCategoryId = categoryMap.get('adelphi-injectables');
            } else if (tags.includes('testosterone') || tags.includes('trt')) {
              targetCategoryId = categoryMap.get('adelphi-test');
            } else {
              // Default to Adelphi Research parent category
              targetCategoryId = categoryMap.get('adelphi-research');
            }
          } else if (tags.includes('rohm')) {
            if (tags.includes('oxandrolone') || tags.includes('anavar')) {
              targetCategoryId = categoryMap.get('rohm-anavar');
            } else if (tags.includes('oral') || tags.includes('tablets')) {
              targetCategoryId = categoryMap.get('rohm-orals');
            } else if (tags.includes('injectable') || tags.includes('intramuscular')) {
              targetCategoryId = categoryMap.get('rohm-injectables');
            } else if (tags.includes('testosterone') || tags.includes('trt')) {
              targetCategoryId = categoryMap.get('rohm-test');
            } else {
              // Default to Rohm Labs parent category
              targetCategoryId = categoryMap.get('rohm-labs');
            }
          }
        }

        // Assign category if found
        if (targetCategoryId) {
          await productModuleService.updateProducts(product.id, {
            category_ids: [targetCategoryId],
          });

          const categoryName = existingCategories.find((cat) => cat.id === targetCategoryId)?.name || 'Unknown';
          console.log(`✅ Assigned category "${categoryName}" to product: ${product.title}`);
          categorizedCount++;
        } else {
          console.log(`⚠️ Could not find appropriate category for product: ${product.title}`);
          skippedCount++;
        }
      } catch (error) {
        console.log(`❌ Error processing product "${product.title}":`, error.message);
        skippedCount++;
      }
    }

    console.log('\n📊 Categorization Summary:');
    console.log(`✅ Products categorized: ${categorizedCount}`);
    console.log(`⏭️ Products skipped: ${skippedCount}`);
    console.log(`📦 Total products processed: ${products.length}`);

    if (categorizedCount > 0) {
      console.log('\n🎉 Category assignment completed successfully!');
    }
  } catch (error) {
    console.error('❌ Error during category assignment:', error);
    throw error;
  }
}

export default assignProductCategories;
