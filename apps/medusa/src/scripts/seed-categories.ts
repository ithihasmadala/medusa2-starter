import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';

async function seedCategories({ container }: ExecArgs) {
  console.log('🌱 Starting to seed categories...');

  try {
    // Get the product module service
    const productModuleService = container.resolve(Modules.PRODUCT);

    // Define parent categories first
    const parentCategories = [
      {
        name: 'Tirzepatide Compound',
        handle: 'tirzepatide-compound',
        description: 'Tirzepatide compound products',
        is_active: true,
        is_internal: false,
      },
      {
        name: 'Retatrutide Peptide',
        handle: 'retatrutide-peptide',
        description: 'Retatrutide peptide products',
        is_active: true,
        is_internal: false,
      },
      {
        name: 'Pharmaceutical',
        handle: 'pharmaceutical',
        description: 'Pharmaceutical grade products',
        is_active: true,
        is_internal: false,
      },
      {
        name: 'Adelphi Research',
        handle: 'adelphi-research',
        description: 'Adelphi Research products',
        is_active: true,
        is_internal: false,
      },
      {
        name: 'Rohm Labs',
        handle: 'rohm-labs',
        description: 'Rohm Labs products',
        is_active: true,
        is_internal: false,
      },
      {
        name: 'Hilma Biocare',
        handle: 'hilma-biocare',
        description: 'Hilma Biocare products',
        is_active: true,
        is_internal: false,
      },
      {
        name: 'Optimum Biotech',
        handle: 'optimum-biotech',
        description: 'Optimum Biotech products',
        is_active: true,
        is_internal: false,
      },
    ];

    // Create parent categories first
    console.log('📂 Creating parent categories...');
    const createdParentCategories = [];
    const categoryMap = new Map();

    for (const category of parentCategories) {
      try {
        const created = await productModuleService.createProductCategories(category);
        createdParentCategories.push(created);
        categoryMap.set(category.handle, created.id);
        console.log(`✅ Created parent category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Parent category "${category.name}" might already exist:`, error.message);
        // Try to find existing category
        try {
          const existing = await productModuleService.listProductCategories({ handle: category.handle });
          if (existing.length > 0) {
            categoryMap.set(category.handle, existing[0].id);
            console.log(`📋 Found existing parent category: ${category.name}`);
          }
        } catch (findError) {
          console.log(`Could not find existing category: ${category.name}`);
        }
      }
    }

    // Define subcategories with their parent relationships
    const subcategories = [
      // Tirzepatide Compound subcategories
      {
        name: 'Tirzepatide 20mg Pen',
        handle: 'tirzepatide-20mg-pen',
        description: 'Tirzepatide 20mg pen products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('tirzepatide-compound'),
      },
      {
        name: 'Tirzepatide 40mg Pen',
        handle: 'tirzepatide-40mg-pen',
        description: 'Tirzepatide 40mg pen products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('tirzepatide-compound'),
      },

      // Retatrutide Peptide subcategories
      {
        name: 'Retatrutide Price',
        handle: 'retatrutide-price',
        description: 'Retatrutide pricing category',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('retatrutide-peptide'),
      },
      {
        name: 'Retatrutide Pen UK',
        handle: 'retatrutide-pen-uk',
        description: 'Retatrutide pen products in UK',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('retatrutide-peptide'),
      },

      // Pharmaceutical subcategories
      {
        name: 'Pharma Test',
        handle: 'pharma-test',
        description: 'Pharmaceutical testosterone products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('pharmaceutical'),
      },
      {
        name: 'Pharma PCT',
        handle: 'pharma-pct',
        description: 'Pharmaceutical PCT products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('pharmaceutical'),
      },
      {
        name: 'Pfizer Genotropin Pen UK',
        handle: 'pfizer-genotropin-pen-uk',
        description: 'Pfizer Genotropin pen products in UK',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('pharmaceutical'),
      },
      {
        name: 'GenXtropin HGH',
        handle: 'genxtropin-hgh',
        description: 'GenXtropin HGH products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('pharmaceutical'),
      },
      {
        name: 'Adelphi HGH',
        handle: 'adelphi-hgh',
        description: 'Adelphi HGH products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('pharmaceutical'),
      },
      {
        name: 'Pharma Weight Loss',
        handle: 'pharma-weight-loss',
        description: 'Pharmaceutical weight loss products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('pharmaceutical'),
      },

      // Adelphi Research subcategories
      {
        name: 'Adelphi Anavar',
        handle: 'adelphi-anavar',
        description: 'Adelphi Anavar products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('adelphi-research'),
      },
      {
        name: 'Adelphi Orals',
        handle: 'adelphi-orals',
        description: 'Adelphi oral steroid products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('adelphi-research'),
      },
      {
        name: 'Adelphi Test',
        handle: 'adelphi-test',
        description: 'Adelphi testosterone products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('adelphi-research'),
      },
      {
        name: 'Adelphi Injectables',
        handle: 'adelphi-injectables',
        description: 'Adelphi injectable steroid products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('adelphi-research'),
      },

      // Rohm Labs subcategories (same as Adelphi as requested)
      {
        name: 'Rohm Anavar',
        handle: 'rohm-anavar',
        description: 'Rohm Anavar products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('rohm-labs'),
      },
      {
        name: 'Rohm Orals',
        handle: 'rohm-orals',
        description: 'Rohm oral steroid products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('rohm-labs'),
      },
      {
        name: 'Rohm Test',
        handle: 'rohm-test',
        description: 'Rohm testosterone products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('rohm-labs'),
      },
      {
        name: 'Rohm Injectables',
        handle: 'rohm-injectables',
        description: 'Rohm injectable steroid products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('rohm-labs'),
      },

      // Hilma Biocare subcategories
      {
        name: 'Anavar Only',
        handle: 'anavar-only-hilma',
        description: 'Hilma Biocare Anavar only products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('hilma-biocare'),
      },

      // Optimum Biotech subcategories
      {
        name: 'Anavar Only',
        handle: 'anavar-only-optimum',
        description: 'Optimum Biotech Anavar only products',
        is_active: true,
        is_internal: false,
        parent_category_id: categoryMap.get('optimum-biotech'),
      },
    ];

    // Create subcategories
    console.log('📁 Creating subcategories...');
    const createdSubcategories = [];

    for (const category of subcategories) {
      if (category.parent_category_id) {
        try {
          const created = await productModuleService.createProductCategories(category);
          createdSubcategories.push(created);
          console.log(`✅ Created subcategory: ${category.name}`);
        } catch (error) {
          console.log(`⚠️ Subcategory "${category.name}" might already exist:`, error.message);
        }
      } else {
        console.log(`⚠️ Skipping subcategory "${category.name}" - parent not found`);
      }
    }

    console.log('🎉 All categories seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Parent Categories: ${createdParentCategories.length}`);
    console.log(`- Subcategories: ${createdSubcategories.length}`);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

export default seedCategories;
