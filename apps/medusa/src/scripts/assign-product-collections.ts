import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

async function assignProductCollections({ container }: ExecArgs) {
  console.log('🏷️ Starting to assign collections to products...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Get existing collections
    console.log('📦 Loading existing collections...');
    const existingCollections = await productModuleService.listProductCollections({});
    const collectionMap = new Map<string, string>();

    for (const collection of existingCollections) {
      collectionMap.set(collection.handle, collection.id);
      console.log(`📋 Found collection: ${collection.title} (${collection.handle})`);
    }

    // Find the brand collections we need
    const adelphiCollectionId = collectionMap.get('adelphi-research');
    const rohmCollectionId = collectionMap.get('rohm-labs');

    if (!adelphiCollectionId) {
      throw new Error('Adelphi Research collection not found. Please run seed:collections first.');
    }

    if (!rohmCollectionId) {
      throw new Error('Rohm Labs collection not found. Please run seed:collections first.');
    }

    // Get all products
    console.log('📦 Fetching all products...');
    const products = await productModuleService.listProducts({
      relations: ['collection', 'categories'],
    });

    console.log(`Found ${products.length} products to process`);

    let adelphiCount = 0;
    let rohmCount = 0;
    let skippedCount = 0;

    // Process each product
    for (const product of products) {
      try {
        let targetCollectionId: string | null = null;
        let brandName = '';

        // Determine brand from product title or categories
        const productTitle = product.title.toLowerCase();

        // Check if it's an Adelphi product
        if (productTitle.includes('adelphi')) {
          targetCollectionId = adelphiCollectionId;
          brandName = 'Adelphi Research';
          adelphiCount++;
        }
        // Check if it's a Rohm product
        else if (productTitle.includes('rohm')) {
          targetCollectionId = rohmCollectionId;
          brandName = 'Rohm Labs';
          rohmCount++;
        }
        // Check categories for brand information
        else if (product.categories) {
          const hasAdelphiCategory = product.categories.some(
            (cat) => cat.handle?.includes('adelphi') || cat.name?.toLowerCase().includes('adelphi'),
          );
          const hasRohmCategory = product.categories.some(
            (cat) => cat.handle?.includes('rohm') || cat.name?.toLowerCase().includes('rohm'),
          );

          if (hasAdelphiCategory) {
            targetCollectionId = adelphiCollectionId;
            brandName = 'Adelphi Research';
            adelphiCount++;
          } else if (hasRohmCategory) {
            targetCollectionId = rohmCollectionId;
            brandName = 'Rohm Labs';
            rohmCount++;
          }
        }

        // Assign collection if we found a match
        if (targetCollectionId) {
          // Check if product already has the correct collection
          if (product.collection?.id === targetCollectionId) {
            console.log(`⏭️ Product "${product.title}" already has correct collection, skipping`);
            skippedCount++;
            continue;
          }

          await productModuleService.updateProducts(product.id, {
            collection_id: targetCollectionId,
          });

          console.log(`✅ Assigned "${brandName}" collection to product: ${product.title}`);
        } else {
          console.log(`⚠️ Could not determine brand for product: ${product.title}`);
          skippedCount++;
        }
      } catch (error) {
        console.log(`❌ Error processing product "${product.title}":`, error.message);
        skippedCount++;
      }
    }

    console.log('\n📊 Collection Assignment Summary:');
    console.log(`✅ Adelphi Research products assigned: ${adelphiCount}`);
    console.log(`✅ Rohm Labs products assigned: ${rohmCount}`);
    console.log(`⏭️ Products skipped: ${skippedCount}`);
    console.log(`📦 Total products processed: ${products.length}`);

    if (adelphiCount > 0 || rohmCount > 0) {
      console.log('\n🎉 Collection assignment completed successfully!');
      console.log('📝 Summary:');
      console.log(`   • Adelphi Research collection: ${adelphiCount} products`);
      console.log(`   • Rohm Labs collection: ${rohmCount} products`);
    }
  } catch (error) {
    console.error('❌ Error during collection assignment:', error);
    throw error;
  }
}

export default assignProductCollections;
