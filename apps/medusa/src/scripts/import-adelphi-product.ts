import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';
import { createProductsWorkflow } from '@medusajs/core-flows';

async function importAdelphiProduct({ container }: ExecArgs) {
  console.log('🚀 Starting Adelphi product import...');

  try {
    // Get required services
    const productModuleService = container.resolve(Modules.PRODUCT);
    const pricingModuleService = container.resolve(Modules.PRICING);

    // Get required data first
    console.log('📦 Getting required data...');

    // Get product type
    const allProductTypes = await productModuleService.listProductTypes({});
    const productType = allProductTypes.find((pt) => pt.value === 'Oral Steroids');

    if (!productType) {
      throw new Error('Product type "Oral Steroids" not found');
    }

    // Get collection
    const allCollections = await productModuleService.listProductCollections({});
    const collection = allCollections.find((c) => c.handle === 'adelphi-research');

    if (!collection) {
      throw new Error('Collection "adelphi-research" not found');
    }

    // Get tags
    const allTags = await productModuleService.listProductTags({});
    const tagValues = [
      'adelphi',
      'anavar',
      'oxandrolone',
      'oral',
      'cutting',
      'lean-mass',
      'fat-loss',
      'beginner',
      'pharmaceutical-grade',
    ];
    const tags = allTags.filter((tag) => tagValues.includes(tag.value));

    console.log(`Found ${tags.length} tags out of ${tagValues.length} requested`);

    // Product data for workflow
    const productData = {
      title: 'Adelphi Anavar 10mg',
      subtitle: 'Premium Oxandrolone Tablets',
      description:
        'High-quality Oxandrolone (Anavar) 10mg tablets from Adelphi Research. Known for lean muscle gains and fat loss with minimal side effects. Perfect for cutting cycles and beginners. Each bottle contains 100 tablets of pharmaceutical-grade Oxandrolone.',
      handle: 'adelphi-anavar-10mg-v2',
      status: 'published',
      thumbnail: 'https://omnicomhealthgroup.com/wp-content/uploads/2024/09/adelphi.png',
      weight: 50,
      length: 8,
      width: 8,
      height: 3,
      hs_code: '30049099',
      origin_country: 'United Kingdom',
      mid_code: 'ADL-ANV-10',
      material: 'Pharmaceutical Grade',
      discountable: false,
      external_id: 'ADL-ANV-10-001',
      type_id: productType.id,
      collection_id: collection.id,
      tag_ids: tags.map((tag) => tag.id),
      options: [
        {
          title: 'Quantity',
          values: ['100 Tablets'],
        },
      ],
      variants: [
        {
          title: '100 Tablets',
          sku: 'ADL-ANV-10-100-V2',
          barcode: '5060123456789',
          weight: 50,
          length: 8,
          width: 8,
          height: 3,
          hs_code: '30049099',
          origin_country: 'United Kingdom',
          mid_code: 'ADL-ANV-10',
          material: 'Pharmaceutical Grade',
          inventory_quantity: 50,
          allow_backorder: true,
          manage_inventory: true,
          options: {
            Quantity: '100 Tablets',
          },
          prices: [
            {
              amount: 4500, // €45.00 in cents
              currency_code: 'eur',
            },
            {
              amount: 5400, // $54.00 in cents
              currency_code: 'usd',
            },
          ],
        },
      ],
      images: [
        {
          url: 'https://omnicomhealthgroup.com/wp-content/uploads/2024/09/adelphi.png',
        },
      ],
    };

    console.log('📦 Creating product using workflow...');

    // Create the product using workflow
    const workflow = createProductsWorkflow(container);
    const { result } = await workflow.run({
      input: {
        products: [productData],
      },
    });

    const product = result[0];
    console.log(`✅ Product created: ${product.title} (ID: ${product.id})`);

    const variant = product.variants[0];
    console.log(`✅ Variant created: ${variant.title} (SKU: ${variant.sku})`);

    console.log('\n🎉 Adelphi product import completed successfully!');
    console.log(`📋 Product Summary:`);
    console.log(`   - Title: ${product.title}`);
    console.log(`   - Handle: ${product.handle}`);
    console.log(`   - SKU: ${variant.sku}`);
    console.log(`   - Inventory: ${variant.inventory_quantity} units`);
    console.log(`   - Price: €45.00 / $54.00`);
    console.log(`   - Tags: ${productData.tags.map((t) => t.value).join(', ')}`);
    console.log(`   - Collection: Adelphi Research`);
    console.log(`   - Type: Oral Steroids`);
  } catch (error) {
    console.error('❌ Error importing Adelphi product:', error);
    throw error;
  }
}

export default importAdelphiProduct;
