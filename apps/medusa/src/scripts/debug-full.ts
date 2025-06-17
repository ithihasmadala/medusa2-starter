import type { ExecArgs } from '@medusajs/types';

async function debugFull({ container }: ExecArgs) {
  console.log('🔍 Full debugging...');

  try {
    const productService = container.resolve('product');

    // Get all collections
    console.log('\n📦 ALL COLLECTIONS:');
    const collections = await productService.listProductCollections({});
    collections.forEach((coll, index) => {
      console.log(`${index + 1}. "${coll.title}" (handle: ${coll.handle})`);
    });

    // Get all categories
    console.log('\n📂 ALL CATEGORIES:');
    const categories = await productService.listProductCategories({});
    categories.forEach((cat, index) => {
      console.log(
        `${index + 1}. "${cat.name || 'UNDEFINED NAME'}" (handle: ${cat.handle || 'UNDEFINED HANDLE'}, id: ${cat.id})`,
      );
    });

    // Check if there are any Adelphi or Rohm categories
    console.log('\n🔍 ADELPHI CATEGORIES:');
    const adelphiCategories = categories.filter(
      (cat) =>
        (cat.name && cat.name.toLowerCase().includes('adelphi')) ||
        (cat.handle && cat.handle.toLowerCase().includes('adelphi')),
    );
    console.log(`Found ${adelphiCategories.length} Adelphi categories:`);
    adelphiCategories.forEach((cat) => {
      console.log(`  - "${cat.name}" (${cat.handle})`);
    });

    console.log('\n🔍 ROHM CATEGORIES:');
    const rohmCategories = categories.filter(
      (cat) =>
        (cat.name && cat.name.toLowerCase().includes('rohm')) ||
        (cat.handle && cat.handle.toLowerCase().includes('rohm')),
    );
    console.log(`Found ${rohmCategories.length} Rohm categories:`);
    rohmCategories.forEach((cat) => {
      console.log(`  - "${cat.name}" (${cat.handle})`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

export default debugFull;
