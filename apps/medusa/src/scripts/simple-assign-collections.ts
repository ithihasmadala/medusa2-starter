import { Client } from 'pg';

async function simpleAssignCollections() {
  console.log('🏷️ Starting simple collection assignment...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medusa2',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Get collection IDs
    const collectionsResult = await client.query(`
      SELECT id, handle, title FROM product_collection 
      WHERE handle IN ('adelphi-research', 'rohm-labs')
    `);

    const collections = collectionsResult.rows;
    console.log('📦 Found collections:', collections);

    if (collections.length === 0) {
      console.log('❌ No collections found. Make sure to run seed:collections first.');
      return;
    }

    const adelphiCollection = collections.find((c) => c.handle === 'adelphi-research');
    const rohmCollection = collections.find((c) => c.handle === 'rohm-labs');

    if (!adelphiCollection) {
      console.log('❌ Adelphi Research collection not found');
      return;
    }

    if (!rohmCollection) {
      console.log('❌ Rohm Labs collection not found');
      return;
    }

    // Get all products
    const productsResult = await client.query(`
      SELECT id, title, collection_id FROM product
    `);

    const products = productsResult.rows;
    console.log(`📦 Found ${products.length} products to process`);

    let adelphiCount = 0;
    let rohmCount = 0;
    let skippedCount = 0;

    // Process each product
    for (const product of products) {
      try {
        let targetCollectionId: string | null = null;
        let brandName = '';

        const productTitle = product.title.toLowerCase();

        // Check if it's an Adelphi product
        if (productTitle.includes('adelphi')) {
          targetCollectionId = adelphiCollection.id;
          brandName = 'Adelphi Research';
          adelphiCount++;
        }
        // Check if it's a Rohm product
        else if (productTitle.includes('rohm')) {
          targetCollectionId = rohmCollection.id;
          brandName = 'Rohm Labs';
          rohmCount++;
        }

        // Assign collection if we found a match
        if (targetCollectionId) {
          // Check if product already has the correct collection
          if (product.collection_id === targetCollectionId) {
            console.log(`⏭️ Product "${product.title}" already has correct collection, skipping`);
            skippedCount++;
            continue;
          }

          await client.query(
            `
            UPDATE product 
            SET collection_id = $1, updated_at = NOW() 
            WHERE id = $2
          `,
            [targetCollectionId, product.id],
          );

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
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
simpleAssignCollections().catch(console.error);
