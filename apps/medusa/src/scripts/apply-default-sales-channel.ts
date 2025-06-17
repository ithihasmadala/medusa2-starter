import type { ExecArgs } from '@medusajs/framework/types';
import { updateProductsWorkflow } from '@medusajs/core-flows';

export default async function applyDefaultSalesChannel({ container }: ExecArgs) {
  console.log('🚀 Applying Default Sales Channel to all products...');

  // 1. Resolve services
  const productService = container.resolve('product');
  const salesChannelService = container.resolve('sales_channel');

  // 2. Find the Default Sales Channel
  const salesChannels = await salesChannelService.listSalesChannels({ name: 'Default Sales Channel' });
  if (!salesChannels.length) {
    throw new Error('Default Sales Channel not found');
  }
  const defaultSalesChannel = salesChannels[0];

  // 3. Get all products (adjust limit as needed)
  const allProducts = await productService.listProducts({}, { limit: 1000 });

  let updatedCount = 0;
  for (const product of allProducts) {
    // If already associated, skip
    if (product.sales_channels?.some((sc) => sc.id === defaultSalesChannel.id)) continue;

    const workflow = updateProductsWorkflow(container);
    await workflow.run({
      input: {
        products: [
          {
            id: product.id,
            sales_channels: [
              ...(product.sales_channels || []).map((sc) => ({ id: sc.id })),
              { id: defaultSalesChannel.id },
            ],
          },
        ],
      },
    });

    updatedCount++;
    console.log(`✅ Updated product ${product.title} (${product.id})`);
  }

  console.log(`🎉 Done! ${updatedCount} products associated with Default Sales Channel.`);
}
