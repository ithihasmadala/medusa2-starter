import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

async function seedCollections({ container }: ExecArgs) {
  console.log('🌱 Starting to seed collections...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Define collections
    const collections = [
      {
        title: 'Tirzepatide Compound',
        handle: 'tirzepatide-compound',
        metadata: { category: 'weight-loss', type: 'compound' },
      },
      {
        title: 'Retatrutide Peptide',
        handle: 'retatrutide-peptide',
        metadata: { category: 'weight-loss', type: 'peptide' },
      },
      {
        title: 'Pharmaceutical',
        handle: 'pharmaceutical',
        metadata: { category: 'pharmaceutical', grade: 'pharmaceutical' },
      },
      {
        title: 'Adelphi Research',
        handle: 'adelphi-research',
        metadata: { category: 'brand', brand: 'adelphi' },
      },
      {
        title: 'Rohm Labs',
        handle: 'rohm-labs',
        metadata: { category: 'brand', brand: 'rohm' },
      },
      {
        title: 'Hilma Biocare',
        handle: 'hilma-biocare',
        metadata: { category: 'brand', brand: 'hilma' },
      },
      {
        title: 'Optimum Biotech',
        handle: 'optimum-biotech',
        metadata: { category: 'brand', brand: 'optimum' },
      },
    ];

    // Create collections
    console.log('📦 Creating collections...');
    const createdCollections = [];

    for (const collection of collections) {
      try {
        const created = await productModuleService.createProductCollections(collection);
        createdCollections.push(created);
        console.log(`✅ Created collection: ${collection.title}`);
      } catch (error) {
        console.log(`⚠️ Collection "${collection.title}" might already exist:`, error.message);
      }
    }

    console.log('🎉 All collections seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Collections Created: ${createdCollections.length}`);
  } catch (error) {
    console.error('❌ Error seeding collections:', error);
    throw error;
  }
}

export default seedCollections;
