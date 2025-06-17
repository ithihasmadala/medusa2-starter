import type { ExecArgs } from '@medusajs/types';
import { updateProductsWorkflow } from '@medusajs/core-flows';

async function assignProductCategories({ container }: ExecArgs) {
  console.log('🏷️ Starting to assign categories to products...');

  try {
    // Get the product service
    const productService = container.resolve('product');

    // Get existing categories and collections
    console.log('📂 Loading existing categories...');
    const existingCategories = await productService.listProductCategories({});
    console.log(`Found ${existingCategories.length} categories`);

    const existingCollections = await productService.listProductCollections({});
    console.log(`Found ${existingCollections.length} collections`);

    // Build maps for easier lookup
    const categoryMap = new Map<string, string>();
    const categoryByNameMap = new Map<string, string>();

    for (const category of existingCategories) {
      if (category.handle) {
        categoryMap.set(category.handle, category.id);
      }
      if (category.name) {
        categoryByNameMap.set(category.name.toLowerCase(), category.id);
      }
    }

    const collectionMap = new Map<string, string>();
    for (const collection of existingCollections) {
      if (collection.handle) {
        collectionMap.set(collection.handle, collection.id);
      }
    }

    // Get all products (without relations first, then fetch related data separately)
    console.log('📦 Fetching all products...');
    const products = await productService.listProducts({});

    console.log(`Found ${products.length} products to categorize`);

    let categorizedCount = 0;
    let skippedCount = 0;

    // Process each product
    for (const product of products) {
      try {
        // Get product details including categories, collection, and tags
        const productDetails = await productService.retrieveProduct(product.id, {
          relations: ['categories', 'collection', 'tags'],
        });

        // Skip if product already has categories
        if (productDetails.categories && productDetails.categories.length > 0) {
          console.log(`⏭️ Product "${productDetails.title}" already has categories, skipping`);
          skippedCount++;
          continue;
        }

        let targetCategoryId: string | null = null;

        // First, try to categorize based on collection
        if (productDetails.collection?.handle) {
          console.log(`🔍 Product "${productDetails.title}" has collection: ${productDetails.collection.handle}`);

          // Map collection to category based on naming patterns
          const collectionHandle = productDetails.collection.handle;

          // Look for direct category match with collection handle
          if (categoryMap.has(collectionHandle)) {
            targetCategoryId = categoryMap.get(collectionHandle)!;
            console.log(`✅ Direct match: ${collectionHandle} -> category`);
          } else {
            // Try to match by collection name pattern
            if (collectionHandle.includes('adelphi')) {
              // Look for any Adelphi category
              const adelphiCategory = [...categoryByNameMap.keys()].find((name) => name.includes('adelphi'));
              if (adelphiCategory) {
                targetCategoryId = categoryByNameMap.get(adelphiCategory)!;
                console.log(`🎯 Mapped Adelphi product to category: ${adelphiCategory}`);
              }
            } else if (collectionHandle.includes('rohm')) {
              // Look for any Rohm category
              const rohmCategory = [...categoryByNameMap.keys()].find((name) => name.includes('rohm'));
              if (rohmCategory) {
                targetCategoryId = categoryByNameMap.get(rohmCategory)!;
                console.log(`🎯 Mapped Rohm product to category: ${rohmCategory}`);
              }
            }
          }
        }

        // If no collection-based category found, try tags or product title
        if (!targetCategoryId) {
          const productTitle = productDetails.title?.toLowerCase() || '';
          const tags = productDetails.tags?.map((tag) => tag.value?.toLowerCase() || '') || [];
          const allText = [productTitle, ...tags].join(' ');

          console.log(`🔍 Trying fallback categorization for: ${productDetails.title}`);

          // Look for brand mentions in title or tags
          if (allText.includes('adelphi')) {
            const adelphiCategory = [...categoryByNameMap.keys()].find((name) => name.includes('adelphi'));
            if (adelphiCategory) {
              targetCategoryId = categoryByNameMap.get(adelphiCategory)!;
              console.log(`🏷️ Categorized by brand (Adelphi): ${adelphiCategory}`);
            }
          } else if (allText.includes('rohm')) {
            const rohmCategory = [...categoryByNameMap.keys()].find((name) => name.includes('rohm'));
            if (rohmCategory) {
              targetCategoryId = categoryByNameMap.get(rohmCategory)!;
              console.log(`🏷️ Categorized by brand (Rohm): ${rohmCategory}`);
            }
          }
        }

        // Apply category if found
        if (targetCategoryId) {
          try {
            const workflow = updateProductsWorkflow(container);
            await workflow.run({
              input: {
                products: [
                  {
                    id: productDetails.id,
                    category_ids: [targetCategoryId],
                  },
                ],
              },
            });

            const categoryName = existingCategories.find((cat) => cat.id === targetCategoryId)?.name || 'Unknown';
            console.log(`✅ Assigned category "${categoryName}" to product: ${productDetails.title}`);
            categorizedCount++;
          } catch (updateError) {
            console.log(`❌ Error updating product "${productDetails.title}":`, updateError.message);
            skippedCount++;
          }
        } else {
          console.log(`⚠️ Could not find appropriate category for product: ${productDetails.title}`);
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
    } else {
      console.log('\n⚠️ No products were categorized. Check if categories exist and have proper handles/names.');
    }
  } catch (error) {
    console.error('❌ Error during category assignment:', error);
    throw error;
  }
}

export default assignProductCategories;
