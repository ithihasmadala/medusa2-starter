import { createProductsWorkflow, createInventoryItemsWorkflow } from '@medusajs/core-flows';
import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';
import fs from 'fs';
import path from 'path';

interface CSVProduct {
  id: string;
  handle: string;
  title: string;
  status: string;
  description: string;
  images: string;
  collection_id: string;
  product_type_id: string;
  variant_id: string;
  variant_title: string;
  variant_sku: string;
  variant_barcode: string;
  variant_hs_code: string;
  variant_origin_country: string;
  variant_mid_code: string;
  variant_material: string;
  variant_weight: string;
  variant_length: string;
  variant_width: string;
  variant_height: string;
  variant_allow_backorder: string;
  variant_manage_inventory: string;
  variant_inventory_quantity: string;
  price_gbp: string;
  price_usd: string;
  price_cad: string;
  sales_channel_id: string;
  tags: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCSVProduct(headers: string[], values: string[]): CSVProduct {
  const product: any = {};

  headers.forEach((header, index) => {
    const cleanHeader = header.replace(/"/g, '').trim();
    const value = values[index] ? values[index].replace(/"/g, '').trim() : '';

    // Map CSV headers to our interface
    switch (cleanHeader) {
      case 'Product Id':
        product.id = value;
        break;
      case 'Product Handle':
        product.handle = value;
        break;
      case 'Product Title':
        product.title = value;
        break;
      case 'Product Status':
        product.status = value;
        break;
      case 'Product Description':
        product.description = value;
        break;
      case 'Product Thumbnail':
        product.images = value;
        break;
      case 'Product Collection Id':
        product.collection_id = value;
        break;
      case 'Product Type Id':
        product.product_type_id = value;
        break;
      case 'Variant ID':
        product.variant_id = value;
        break;
      case 'Variant Title':
        product.variant_title = value;
        break;
      case 'Variant SKU':
        product.variant_sku = value;
        break;
      case 'Variant Barcode':
        product.variant_barcode = value;
        break;
      case 'Variant HS Code':
        product.variant_hs_code = value;
        break;
      case 'Variant Origin Country':
        product.variant_origin_country = value;
        break;
      case 'Variant MID Code':
        product.variant_mid_code = value;
        break;
      case 'Variant Material':
        product.variant_material = value;
        break;
      case 'Variant Weight':
        product.variant_weight = value;
        break;
      case 'Variant Length':
        product.variant_length = value;
        break;
      case 'Variant Width':
        product.variant_width = value;
        break;
      case 'Variant Height':
        product.variant_height = value;
        break;
      case 'Variant Origin Country':
        product.variant_origin_country = value;
        break;
      case 'Variant MID Code':
        product.variant_mid_code = value;
        break;
      case 'Variant Material':
        product.variant_material = value;
        break;
      case 'Variant Weight (g)':
        product.variant_weight = value;
        break;
      case 'Variant Length (cm)':
        product.variant_length = value;
        break;
      case 'Variant Width (cm)':
        product.variant_width = value;
        break;
      case 'Variant Height (cm)':
        product.variant_height = value;
        break;
      case 'Variant Allow Backorder':
        product.variant_allow_backorder = value;
        break;
      case 'Variant Manage Inventory':
        product.variant_manage_inventory = value;
        break;
      case 'Variant Inventory Quantity':
        product.variant_inventory_quantity = value;
        break;
      case 'Price GBP':
        product.price_gbp = value;
        break;
      case 'Price USD':
        product.price_usd = value;
        break;
      case 'Price CAD':
        product.price_cad = value;
        break;
      case 'Sales Channel ID':
        product.sales_channel_id = value;
        break;
      case 'Tags':
        product.tags = value;
        break;
    }
  });

  return product as CSVProduct;
}

function findMatchingCollection(csvProduct: CSVProduct, collections: any[]): string | undefined {
  // Try to match by title keywords
  const productTitle = csvProduct.title.toLowerCase();
  const productDescription = (csvProduct.description || '').toLowerCase();

  for (const collection of collections) {
    const collectionTitle = collection.title.toLowerCase();

    // Check if collection name appears in product title or description
    if (productTitle.includes(collectionTitle) || productDescription.includes(collectionTitle)) {
      return collection.id;
    }

    // Check for brand matches (Adelphi, Rohm, etc.)
    if (collectionTitle.includes('adelphi') && productTitle.includes('adelphi')) {
      return collection.id;
    }
    if (collectionTitle.includes('rohm') && productTitle.includes('rohm')) {
      return collection.id;
    }
  }

  return undefined;
}

function findMatchingProductType(csvProduct: CSVProduct, productTypes: any[]): string | undefined {
  const productTitle = csvProduct.title.toLowerCase();
  const productDescription = (csvProduct.description || '').toLowerCase();
  const tags = (csvProduct.tags || '').toLowerCase();

  for (const productType of productTypes) {
    const typeName = productType.value.toLowerCase();

    // Check if type appears in product title, description, or tags
    if (productTitle.includes(typeName) || productDescription.includes(typeName) || tags.includes(typeName)) {
      return productType.id;
    }

    // Specific matching for steroid types
    if (
      typeName.includes('injectable') &&
      (productTitle.includes('test') ||
        productTitle.includes('deca') ||
        productTitle.includes('tren') ||
        productTitle.includes('sustanon'))
    ) {
      return productType.id;
    }

    if (
      typeName.includes('oral') &&
      (productTitle.includes('superdrol') ||
        productTitle.includes('oxy') ||
        productTitle.includes('anavar') ||
        productTitle.includes('winstrol'))
    ) {
      return productType.id;
    }

    if (
      typeName.includes('pct') &&
      (productTitle.includes('clomid') || productTitle.includes('nolvadex') || productTitle.includes('arimidex'))
    ) {
      return productType.id;
    }
  }

  return undefined;
}

async function importSingleProduct({ container }: ExecArgs) {
  const csvPath = path.join(__dirname, '../../../../1749988189725-product-exports-with-pricing.csv');

  // Get the default sales channel
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: 'Default Sales Channel',
  });

  // Get all collections and product types from the database
  const productModuleService = container.resolve(Modules.PRODUCT);
  const collections = await productModuleService.listProductCollections({});
  const productTypes = await productModuleService.listProductTypes({});

  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter((line) => line.trim());

  if (lines.length < 2) {
    console.error('CSV file must have at least a header and one data row');
    process.exit(1);
  }

  // Parse header and seventh product (first six were already imported)
  const headers = parseCSVLine(lines[0]);
  const seventhProductValues = parseCSVLine(lines[7]); // Changed to line 7 for seventh product
  const csvProduct = parseCSVProduct(headers, seventhProductValues);

  console.log('Importing product:', csvProduct.title);

  try {
    // Find matching collection and product type dynamically
    const matchingCollectionId = findMatchingCollection(csvProduct, collections);
    const matchingProductTypeId = findMatchingProductType(csvProduct, productTypes);

    console.log('Matched Collection ID:', matchingCollectionId || 'None');
    console.log('Matched Product Type ID:', matchingProductTypeId || 'None');

    // Prepare product data for Medusa workflow
    const productData = {
      title: csvProduct.title,
      handle: csvProduct.handle,
      description: csvProduct.description || '',
      status: 'published' as any,
      images: csvProduct.images ? csvProduct.images.split(';').map((url) => ({ url: url.trim() })) : [],
      collection_id: matchingCollectionId,
      type_id: matchingProductTypeId,
      tags: csvProduct.tags ? csvProduct.tags.split(',').map((tag) => ({ value: tag.trim() })) : [],
      sales_channels: defaultSalesChannel.length > 0 ? [{ id: defaultSalesChannel[0].id }] : [],
      options: [
        {
          title: 'Default Option',
          values: ['Default'],
        },
      ],
      variants: [
        {
          title: csvProduct.variant_title || 'Default Variant',
          options: {
            'Default Option': 'Default',
          },
          sku: csvProduct.variant_sku || undefined,
          barcode: csvProduct.variant_barcode || undefined,
          hs_code: csvProduct.variant_hs_code || undefined,
          origin_country: csvProduct.variant_origin_country || undefined,
          mid_code: csvProduct.variant_mid_code || undefined,
          material: csvProduct.variant_material || undefined,
          weight: csvProduct.variant_weight ? parseFloat(csvProduct.variant_weight) : undefined,
          length: csvProduct.variant_length ? parseFloat(csvProduct.variant_length) : undefined,
          width: csvProduct.variant_width ? parseFloat(csvProduct.variant_width) : undefined,
          height: csvProduct.variant_height ? parseFloat(csvProduct.variant_height) : undefined,
          allow_backorder: csvProduct.variant_allow_backorder === 'true',
          manage_inventory: true, // Always manage inventory
          prices: [] as any,
        },
      ],
    };

    // Add prices for different currencies
    const prices = [];

    if (csvProduct.price_gbp && parseFloat(csvProduct.price_gbp) > 0) {
      prices.push({
        currency_code: 'gbp',
        amount: Math.round(parseFloat(csvProduct.price_gbp) * 100), // Convert to cents
      });
    }

    if (csvProduct.price_usd && parseFloat(csvProduct.price_usd) > 0) {
      prices.push({
        currency_code: 'usd',
        amount: Math.round(parseFloat(csvProduct.price_usd) * 100), // Convert to cents
      });
    }

    if (csvProduct.price_cad && parseFloat(csvProduct.price_cad) > 0) {
      prices.push({
        currency_code: 'cad',
        amount: Math.round(parseFloat(csvProduct.price_cad) * 100), // Convert to cents
      });
    }

    productData.variants[0].prices = prices;

    // Execute the workflow
    const workflow = createProductsWorkflow(container);
    let result;

    const workflowResult = await workflow.run({
      input: {
        products: [productData as any],
      },
    });
    result = workflowResult.result;

    console.log('✅ Product imported successfully!');
    console.log('Product ID:', result[0].id);
    console.log('Product Title:', result[0].title);
    console.log('Product Handle:', result[0].handle);
    console.log('Variants:', result[0].variants?.length || 0);
    console.log('Tags:', csvProduct.tags || 'None');
    console.log('Final Collection ID:', matchingCollectionId || 'None');
    console.log('Final Product Type ID:', matchingProductTypeId || 'None');

    if ((result[0].variants?.[0] as any)?.prices) {
      console.log('Prices:');
      (result[0].variants[0] as any).prices.forEach((price: any) => {
        console.log(`  ${price.currency_code.toUpperCase()}: ${price.amount / 100}`);
      });
    }

    // Set inventory quantity
    const inventoryQuantity = csvProduct.variant_inventory_quantity
      ? parseInt(csvProduct.variant_inventory_quantity)
      : 10;

    if (result[0].variants?.[0]?.id && inventoryQuantity > 0) {
      try {
        const inventoryModuleService = container.resolve(Modules.INVENTORY);
        const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);

        // Get the first stock location
        const stockLocations = await stockLocationModuleService.listStockLocations({});
        if (stockLocations.length > 0) {
          const stockLocationId = stockLocations[0].id;

          // Create inventory item for the variant
          const inventoryItems = await inventoryModuleService.listInventoryItems({
            sku: csvProduct.variant_sku,
          });

          let inventoryItemId;
          if (inventoryItems.length === 0) {
            const inventoryItem = await inventoryModuleService.createInventoryItems({
              sku: csvProduct.variant_sku || `sku-${result[0].variants[0].id}`,
            });
            inventoryItemId = inventoryItem.id;
          } else {
            inventoryItemId = inventoryItems[0].id;
          }

          // Create inventory level first, then update
          try {
            await inventoryModuleService.createInventoryLevels({
              inventory_item_id: inventoryItemId,
              location_id: stockLocationId,
              stocked_quantity: inventoryQuantity,
            });
          } catch (createError) {
            // If level already exists, update it
            await inventoryModuleService.updateInventoryLevels({
              inventory_item_id: inventoryItemId,
              location_id: stockLocationId,
              stocked_quantity: inventoryQuantity,
            });
          }

          console.log(`✅ Inventory set to ${inventoryQuantity} units`);
        }
      } catch (inventoryError) {
        console.warn('⚠️ Could not set inventory quantity:', inventoryError);
      }
    }
  } catch (error) {
    console.error('❌ Error importing product:', error);
    throw error;
  }
}

// Export as default function for Medusa exec
export default importSingleProduct;
