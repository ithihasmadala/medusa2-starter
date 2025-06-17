import type { ExecArgs } from '@medusajs/types';
import { updateProductsWorkflow } from '@medusajs/core-flows';

async function assignCategoriesByName({ container }: ExecArgs) {
  console.log('🏷️ Starting category assignment based on product types...');

  try {
    const productService = container.resolve('product');

    // Get all products using the correct Medusa v2 method
    console.log('📦 Loading products...');
    const products = await productService.listProducts({});
    console.log(`Found ${products.length} products`);

    // Actual category IDs from the database
    const categoryIds = {
      // Parent categories
      adelphiResearch: 'pcat_01JXZ1MAD8225K820K0XV3DMG6',
      rohmLabs: 'pcat_01JXZ1MADC6EK9CGV1W8KCXEAH',

      // Adelphi subcategories
      adelphiAnavar: 'pcat_01JXZ1MAH12WAQSP0VYW0Z9D84',
      adelphiOrals: 'pcat_01JXZ1MAHBPHASJ98D4ZWTGPP3',
      adelphiTest: 'pcat_01JXZ1MAHMBYET3Y8JJZ9Y5TBD',
      adelphiInjectables: 'pcat_01JXZ1MAHXY8X8GSY6GFP4A7M2',

      // Rohm subcategories
      rohmAnavar: 'pcat_01JXZ1MAJ4QV3EXDW93ZBQVTMJ',
      rohmOrals: 'pcat_01JXZ1MAJAP1NRBNFBPXV6CYZ1',
      rohmTest: 'pcat_01JXZ1MAJJY1GWC10PNZA83KM6',
      rohmInjectables: 'pcat_01JXZ1MAJV7DX8CNMRVX5Z4Q8D',
    };

    console.log('📋 Category mapping:');
    Object.entries(categoryIds).forEach(([key, id]) => {
      console.log(`  ${key}: ${id}`);
    });

    let updatedCount = 0;

    // Process each product
    for (const product of products) {
      const title = product.title.toLowerCase();
      console.log(`\nProcessing: ${product.title}`);

      let categories: string[] = [];

      // Check if it's an Adelphi product
      if (title.includes('adelphi')) {
        // Always add the parent category for Adelphi products
        categories.push(categoryIds.adelphiResearch);

        // Adelphi Anavar - specific products only
        if (title.includes('anavar')) {
          categories.push(categoryIds.adelphiAnavar);
          console.log(`  → Assigned to Adelphi Research + Adelphi Anavar`);
        }
        // Adelphi Test products (testosterone, trt, sustanon, etc.)
        else if (
          title.includes('test') ||
          title.includes('trt') ||
          title.includes('sustanon') ||
          title.includes('testosterone')
        ) {
          categories.push(categoryIds.adelphiTest);
          console.log(`  → Assigned to Adelphi Research + Adelphi Test`);
        }
        // Adelphi Injectables (but exclude oral forms)
        else if (
          (title.includes('deca') ||
            title.includes('npp') ||
            title.includes('boldenone') ||
            title.includes('trenbolone') ||
            title.includes('tren') ||
            title.includes('masteron') ||
            title.includes('primobolan') ||
            title.includes('parabolan') ||
            title.includes('methyl tren') ||
            title.includes('ment') ||
            title.includes('propionate') ||
            title.includes('cypionate') ||
            title.includes('enanthate') ||
            title.includes('blend') ||
            title.includes('rip') ||
            title.includes('mass')) &&
          !title.includes('tabs') &&
          !title.includes('oral')
        ) {
          categories.push(categoryIds.adelphiInjectables);
          console.log(`  → Assigned to Adelphi Research + Adelphi Injectables`);
        }
        // Adelphi Orals (all other oral products including tabs, oral forms, etc.)
        else if (
          title.includes('winstrol') ||
          title.includes('dianabol') ||
          title.includes('triple x') ||
          title.includes('oxy') ||
          title.includes('turinabol') ||
          title.includes('primo tabs') ||
          title.includes('halotestin') ||
          title.includes('superdrol') ||
          title.includes('nolvadex') ||
          title.includes('clomid') ||
          title.includes('proviron') ||
          title.includes('arimidex') ||
          title.includes('aromasin') ||
          title.includes('letrozole') ||
          title.includes('pct') ||
          title.includes('burn') ||
          title.includes('clenbuterol') ||
          title.includes('clen') ||
          title.includes('t3') ||
          title.includes('t4') ||
          title.includes('t5') ||
          title.includes('yohimbine') ||
          title.includes('tabs') ||
          title.includes('oral')
        ) {
          categories.push(categoryIds.adelphiOrals);
          console.log(`  → Assigned to Adelphi Research + Adelphi Orals`);
        } else {
          // Default Adelphi products that don't fit specific categories
          console.log(`  → Assigned to Adelphi Research only (no specific subcategory)`);
        }
      }
      // Check if it's a Rohm product
      else if (title.includes('rohm')) {
        // Always add the parent category for Rohm products
        categories.push(categoryIds.rohmLabs);

        // Rohm Anavar
        if (title.includes('anavar')) {
          categories.push(categoryIds.rohmAnavar);
          console.log(`  → Assigned to Rohm Labs + Rohm Anavar`);
        }
        // Rohm Test products
        else if (
          title.includes('test') ||
          title.includes('trt') ||
          title.includes('sustanon') ||
          title.includes('testosterone')
        ) {
          categories.push(categoryIds.rohmTest);
          console.log(`  → Assigned to Rohm Labs + Rohm Test`);
        }
        // Rohm Injectables
        else if (
          (title.includes('deca') ||
            title.includes('npp') ||
            title.includes('boldenone') ||
            title.includes('trenbolone') ||
            title.includes('tren') ||
            title.includes('masteron') ||
            title.includes('primobolan') ||
            title.includes('propionate') ||
            title.includes('cypionate') ||
            title.includes('enanthate') ||
            title.includes('blend') ||
            title.includes('injectable')) &&
          !title.includes('tabs') &&
          !title.includes('oral')
        ) {
          categories.push(categoryIds.rohmInjectables);
          console.log(`  → Assigned to Rohm Labs + Rohm Injectables`);
        }
        // Rohm Orals
        else if (
          title.includes('winstrol') ||
          title.includes('dianabol') ||
          title.includes('oral') ||
          title.includes('tabs') ||
          title.includes('pct') ||
          title.includes('burn') ||
          title.includes('clenbuterol')
        ) {
          categories.push(categoryIds.rohmOrals);
          console.log(`  → Assigned to Rohm Labs + Rohm Orals`);
        } else {
          // Default Rohm products that don't fit specific categories
          console.log(`  → Assigned to Rohm Labs only (no specific subcategory)`);
        }
      }

      // Update the product with categories if any were assigned
      if (categories.length > 0) {
        try {
          const categoriesToAssign = [...new Set(categories)]; // Remove duplicates

          await updateProductsWorkflow(container).run({
            input: {
              selector: { id: product.id },
              update: {
                categories: categoriesToAssign.map((categoryId) => ({ id: categoryId })),
              },
            },
          });

          updatedCount++;
          console.log(`  ✅ Updated with ${categoriesToAssign.length} categories`);
        } catch (error) {
          console.error(`  ❌ Error updating product: ${error.message}`);
        }
      } else {
        console.log(`  ⚠️ No matching categories found`);
      }
    }

    console.log(`\n🎉 Category assignment completed!`);
    console.log(`📊 Updated ${updatedCount} out of ${products.length} products`);
  } catch (error) {
    console.error('❌ Error during category assignment:', error);
  }
}

export default assignCategoriesByName;
