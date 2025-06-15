import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

async function seedProductTypes({ container }: ExecArgs) {
  console.log('🌱 Starting to seed product types...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Define product types based on the product-types-list.txt
    const productTypes = [
      {
        value: 'Weight Loss Compounds',
        metadata: {
          handle: 'weight-loss-compounds',
          description: 'Advanced weight loss peptides and compounds',
          category: 'body-composition',
          administration: 'injectable',
        },
      },
      {
        value: 'Injectable Steroids',
        metadata: {
          handle: 'injectable-steroids',
          description: 'Intramuscular injectable anabolic steroids',
          category: 'performance-enhancement',
          administration: 'injectable',
        },
      },
      {
        value: 'Oral Steroids',
        metadata: {
          handle: 'oral-steroids',
          description: 'Oral anabolic steroids in tablet/capsule form',
          category: 'performance-enhancement',
          administration: 'oral',
        },
      },
      {
        value: 'Testosterone Products',
        metadata: {
          handle: 'testosterone-products',
          description: 'All testosterone-based products including TRT',
          category: 'performance-enhancement',
          administration: 'injectable',
        },
      },
      {
        value: 'Post Cycle Therapy',
        metadata: {
          handle: 'post-cycle-therapy',
          description: 'Products used for post cycle therapy and hormone regulation',
          category: 'health-recovery',
          administration: 'oral',
        },
      },
      {
        value: 'Fat Burners',
        metadata: {
          handle: 'fat-burners',
          description: 'Thermogenic and fat burning compounds',
          category: 'body-composition',
          administration: 'oral',
        },
      },
      {
        value: 'Growth Hormone',
        metadata: {
          handle: 'growth-hormone',
          description: 'Human growth hormone and related products',
          category: 'health-recovery',
          administration: 'injectable',
        },
      },
      {
        value: 'Pharmaceutical Grade',
        metadata: {
          handle: 'pharmaceutical-grade',
          description: 'Pharmaceutical grade products and medications',
          category: 'health-recovery',
          administration: 'various',
        },
      },
      {
        value: 'Peptides',
        metadata: {
          handle: 'peptides',
          description: 'Peptide compounds and research chemicals',
          category: 'body-composition',
          administration: 'injectable',
        },
      },
      {
        value: 'Anavar Products',
        metadata: {
          handle: 'anavar-products',
          description: 'Oxandrolone (Anavar) products specifically',
          category: 'performance-enhancement',
          administration: 'oral',
        },
      },
    ];

    console.log(`Creating ${productTypes.length} product types...`);

    // Check for existing product types to avoid duplicates
    const existingProductTypes = await productModuleService.listProductTypes({});
    const existingValues = existingProductTypes.map((pt) => pt.value);

    let createdCount = 0;
    let skippedCount = 0;

    for (const productType of productTypes) {
      try {
        if (existingValues.includes(productType.value)) {
          console.log(`⏭️  Skipping existing product type: ${productType.value}`);
          skippedCount++;
          continue;
        }

        const created = await productModuleService.createProductTypes(productType);
        console.log(`✅ Created product type: ${productType.value} (ID: ${created.id})`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Failed to create product type ${productType.value}:`, error);
      }
    }

    console.log(`\n🎉 Product types seeding completed!`);
    console.log(`📊 Summary:`);
    console.log(`   - Created: ${createdCount} product types`);
    console.log(`   - Skipped: ${skippedCount} existing product types`);
    console.log(`   - Total: ${createdCount + skippedCount} product types processed`);

    // List all product types for verification
    const allProductTypes = await productModuleService.listProductTypes({});
    console.log(`\n📋 All product types in database (${allProductTypes.length} total):`);
    allProductTypes.forEach((pt) => {
      console.log(`   - ${pt.value} (${pt.id})`);
    });
  } catch (error) {
    console.error('❌ Error seeding product types:', error);
    throw error;
  }
}

export default seedProductTypes;
