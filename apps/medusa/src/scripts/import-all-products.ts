import {
  createProductsWorkflow,
  createInventoryItemsWorkflow,
  createProductCategoriesWorkflow,
  createProductTagsWorkflow,
} from '@medusajs/core-flows';
import { createCollectionsWorkflow } from '@medusajs/medusa/core-flows';
import type { ExecArgs } from '@medusajs/types';
import { Modules } from '@medusajs/framework/utils';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting product import script...');

interface CSVProduct {
  'Product Id': string;
  'Product Handle': string;
  'Product Title': string;
  'Product Subtitle': string;
  'Product Description': string;
  'Product Status': string;
  'Product Thumbnail': string;
  'Product Weight': string;
  'Product Length': string;
  'Product Width': string;
  'Product Height': string;
  'Product HS Code': string;
  'Product Origin Country': string;
  'Product Mid Code': string;
  'Product Material': string;
  'Product Collection Title': string;
  'Product Collection Handle': string;
  'Product Type': string;
  'Product Tags': string;
  'Product Discountable': string;
  'Product External Id': string;
  'Variant Id': string;
  'Variant Title': string;
  'Variant SKU': string;
  'Variant Barcode': string;
  'Variant Inventory Quantity': string;
  'Variant Allow Backorder': string;
  'Variant Manage Inventory': string;
  'Variant Weight': string;
  'Variant Length': string;
  'Variant Width': string;
  'Variant Height': string;
  'Variant HS Code': string;
  'Variant Origin Country': string;
  'Variant Mid Code': string;
  'Variant Material': string;
  'Option 1 Name': string;
  'Option 1 Value': string;
  'Option 2 Name': string;
  'Option 2 Value': string;
  'Option 3 Name': string;
  'Option 3 Value': string;
  'Variant Price GBP': string;
  'Variant Price USD': string;
  'Variant Price CAD': string;
  'Image 1 Url': string;
  'Image 2 Url': string;
  'Image 3 Url': string;
  'Image 4 Url': string;
  'Image 5 Url': string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
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
        product['Product Id'] = value;
        break;
      case 'Product Handle':
        product['Product Handle'] = value;
        break;
      case 'Product Title':
        product['Product Title'] = value;
        break;
      case 'Product Subtitle':
        product['Product Subtitle'] = value;
        break;
      case 'Product Description':
        product['Product Description'] = value;
        break;
      case 'Product Status':
        product['Product Status'] = value;
        break;
      case 'Product Thumbnail':
        product['Product Thumbnail'] = value;
        break;
      case 'Product Weight':
        product['Product Weight'] = value;
        break;
      case 'Product Length':
        product['Product Length'] = value;
        break;
      case 'Product Width':
        product['Product Width'] = value;
        break;
      case 'Product Height':
        product['Product Height'] = value;
        break;
      case 'Product HS Code':
        product['Product HS Code'] = value;
        break;
      case 'Product Origin Country':
        product['Product Origin Country'] = value;
        break;
      case 'Product Mid Code':
        product['Product Mid Code'] = value;
        break;
      case 'Product Material':
        product['Product Material'] = value;
        break;
      case 'Product Collection Title':
        product['Product Collection Title'] = value;
        break;
      case 'Product Collection Handle':
        product['Product Collection Handle'] = value;
        break;
      case 'Product Type':
        product['Product Type'] = value;
        break;
      case 'Product Tags':
        product['Product Tags'] = value;
        break;
      case 'Product Discountable':
        product['Product Discountable'] = value;
        break;
      case 'Product External Id':
        product['Product External Id'] = value;
        break;
      case 'Variant Id':
        product['Variant Id'] = value;
        break;
      case 'Variant Title':
        product['Variant Title'] = value;
        break;
      case 'Variant SKU':
        product['Variant SKU'] = value;
        break;
      case 'Variant Barcode':
        product['Variant Barcode'] = value;
        break;
      case 'Variant Inventory Quantity':
        product['Variant Inventory Quantity'] = value;
        break;
      case 'Variant Allow Backorder':
        product['Variant Allow Backorder'] = value;
        break;
      case 'Variant Manage Inventory':
        product['Variant Manage Inventory'] = value;
        break;
      case 'Variant Weight':
        product['Variant Weight'] = value;
        break;
      case 'Variant Length':
        product['Variant Length'] = value;
        break;
      case 'Variant Width':
        product['Variant Width'] = value;
        break;
      case 'Variant Height':
        product['Variant Height'] = value;
        break;
      case 'Variant HS Code':
        product['Variant HS Code'] = value;
        break;
      case 'Variant Origin Country':
        product['Variant Origin Country'] = value;
        break;
      case 'Variant Mid Code':
        product['Variant Mid Code'] = value;
        break;
      case 'Variant Material':
        product['Variant Material'] = value;
        break;
      case 'Option 1 Name':
        product['Option 1 Name'] = value;
        break;
      case 'Option 1 Value':
        product['Option 1 Value'] = value;
        break;
      case 'Option 2 Name':
        product['Option 2 Name'] = value;
        break;
      case 'Option 2 Value':
        product['Option 2 Value'] = value;
        break;
      case 'Option 3 Name':
        product['Option 3 Name'] = value;
        break;
      case 'Option 3 Value':
        product['Option 3 Value'] = value;
        break;
      case 'Variant Price GBP':
        product['Variant Price GBP'] = value;
        break;
      case 'Variant Price USD':
        product['Variant Price USD'] = value;
        break;
      case 'Variant Price CAD':
        product['Variant Price CAD'] = value;
        break;
      case 'Image 1 Url':
        product['Image 1 Url'] = value;
        break;
      case 'Image 2 Url':
        product['Image 2 Url'] = value;
        break;
      case 'Image 3 Url':
        product['Image 3 Url'] = value;
        break;
      case 'Image 4 Url':
        product['Image 4 Url'] = value;
        break;
      case 'Image 5 Url':
        product['Image 5 Url'] = value;
        break;
    }
  });

  return product as CSVProduct;
}

async function importAllProducts({ container }: ExecArgs) {
  console.log('📦 Starting product import...');

  // Read and parse CSV file
  const csvFilePath = path.join(process.cwd(), '../../complete-product-catalog.csv');
  console.log(`📁 Reading CSV file from: ${csvFilePath}`);

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found at: ${csvFilePath}`);
    process.exit(1);
  }

  // Get the default sales channel
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: 'Default Sales Channel',
  });

  if (!defaultSalesChannel.length) {
    console.error('❌ Default Sales Channel not found. Please run the seed script first.');
    process.exit(1);
  }

  console.log(`✅ Found default sales channel: ${defaultSalesChannel[0].name}`);

  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = csvContent.split('\n').filter((line) => line.trim());

  if (lines.length < 2) {
    console.error('❌ CSV file must have at least a header and one data row');
    process.exit(1);
  }

  // Parse all products from CSV
  const headers = parseCSVLine(lines[0]);
  const csvProducts: CSVProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      const product = parseCSVProduct(headers, values);
      if (product['Product Title'] && product['Product Handle']) {
        csvProducts.push(product);
      }
    } catch (error) {
      console.warn(`⚠️ Skipping invalid row ${i + 1}:`, error);
    }
  }

  console.log(`📊 Found ${csvProducts.length} products to import`);

  // Get existing entities
  const productModuleService = container.resolve(Modules.PRODUCT);
  const existingCollections = await productModuleService.listProductCollections({});
  const existingProductTypes = await productModuleService.listProductTypes({});
  const existingTags = await productModuleService.listProductTags({});

  // Create maps for quick lookup
  const collectionMap = new Map<string, string>();
  const typeMap = new Map<string, string>();
  const tagMap = new Map<string, string>();

  existingCollections.forEach((c: any) => {
    collectionMap.set(c.title, c.id);
  });

  existingProductTypes.forEach((t: any) => {
    typeMap.set(t.value, t.id);
  });

  existingTags.forEach((t: any) => {
    tagMap.set(t.value, t.id);
  });

  // Extract unique values needed
  const requiredCollections = new Set<string>();
  const requiredTypes = new Set<string>();
  const requiredTags = new Set<string>();

  csvProducts.forEach((product) => {
    if (product['Product Collection Title']) requiredCollections.add(product['Product Collection Title']);
    if (product['Product Type']) requiredTypes.add(product['Product Type']);
    if (product['Product Tags']) {
      product['Product Tags'].split(',').forEach((tag) => {
        const cleanTag = tag.trim();
        if (cleanTag) requiredTags.add(cleanTag);
      });
    }
  });

  // Create missing collections
  const missingCollections = Array.from(requiredCollections).filter((c) => !collectionMap.has(c));
  if (missingCollections.length > 0) {
    console.log(`Creating ${missingCollections.length} missing collections...`);

    const { result: newCollections } = await createCollectionsWorkflow(container).run({
      input: {
        collections: missingCollections.map((title) => ({
          title,
          handle: title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
        })),
      },
    });

    newCollections.forEach((collection: any, index: number) => {
      collectionMap.set(missingCollections[index], collection.id);
    });
  }

  // Create missing product types
  const missingTypes = Array.from(requiredTypes).filter((t) => !typeMap.has(t));
  if (missingTypes.length > 0) {
    console.log(`Creating ${missingTypes.length} missing product types...`);

    for (const typeValue of missingTypes) {
      try {
        const createdType = await productModuleService.createProductTypes({ value: typeValue });
        typeMap.set(typeValue, createdType.id);
      } catch (error) {
        console.warn(`Could not create product type ${typeValue}:`, error);
      }
    }
  }

  // Create missing tags
  const missingTags = Array.from(requiredTags).filter((t) => !tagMap.has(t));
  if (missingTags.length > 0) {
    console.log(`Creating ${missingTags.length} missing tags...`);

    const { result: newTags } = await createProductTagsWorkflow(container).run({
      input: {
        product_tags: missingTags.map((value) => ({ value })),
      },
    });

    newTags.forEach((tag: any, index: number) => {
      tagMap.set(missingTags[index], tag.id);
    });
  }

  console.log('✅ All required entities are ready');

  // Process products in batches
  const batchSize = 5;
  let successfullyImported = 0;
  let skippedDuplicates = 0;
  let failed = 0;

  for (let i = 0; i < csvProducts.length; i += batchSize) {
    const batch = csvProducts.slice(i, i + batchSize);
    console.log(
      `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        csvProducts.length / batchSize,
      )} (${batch.length} products)`,
    );

    const productDataBatch = batch.map((csvProduct) => {
      // Find matching entities
      const matchingCollectionId =
        csvProduct['Product Collection Title'] && collectionMap.has(csvProduct['Product Collection Title'])
          ? collectionMap.get(csvProduct['Product Collection Title'])
          : undefined;

      const matchingProductTypeId =
        csvProduct['Product Type'] && typeMap.has(csvProduct['Product Type'])
          ? typeMap.get(csvProduct['Product Type'])
          : undefined;

      // Prepare product tags
      const productTags = csvProduct['Product Tags']
        ? csvProduct['Product Tags']
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag && tagMap.has(tag))
            .map((tag) => ({ id: tagMap.get(tag)! }))
        : [];

      // Prepare prices
      const prices = [];
      if (csvProduct['Variant Price GBP'] && parseFloat(csvProduct['Variant Price GBP']) > 0) {
        prices.push({
          currency_code: 'gbp',
          amount: Math.round(parseFloat(csvProduct['Variant Price GBP']) * 100),
        });
      }
      if (csvProduct['Variant Price USD'] && parseFloat(csvProduct['Variant Price USD']) > 0) {
        prices.push({
          currency_code: 'usd',
          amount: Math.round(parseFloat(csvProduct['Variant Price USD']) * 100),
        });
      }
      if (csvProduct['Variant Price CAD'] && parseFloat(csvProduct['Variant Price CAD']) > 0) {
        prices.push({
          currency_code: 'cad',
          amount: Math.round(parseFloat(csvProduct['Variant Price CAD']) * 100),
        });
      }

      return {
        title: csvProduct['Product Title'],
        handle: csvProduct['Product Handle'],
        description: csvProduct['Product Description'] || '',
        status: 'published' as any,
        images: csvProduct['Product Thumbnail']
          ? csvProduct['Product Thumbnail'].split(';').map((url) => ({ url: url.trim() }))
          : [],
        collection_id: matchingCollectionId,
        type_id: matchingProductTypeId,
        tags: productTags,
        sales_channels: [{ id: defaultSalesChannel[0].id }],
        options: [
          {
            title: 'Default Option',
            values: ['Default'],
          },
        ],
        variants: [
          {
            title: csvProduct['Variant Title'] || 'Default Variant',
            options: {
              'Default Option': 'Default',
            },
            sku: csvProduct['Variant SKU'] || undefined,
            barcode: csvProduct['Variant Barcode'] || undefined,
            hs_code: csvProduct['Variant HS Code'] || undefined,
            origin_country: csvProduct['Variant Origin Country'] || undefined,
            mid_code: csvProduct['Variant Mid Code'] || undefined,
            material: csvProduct['Variant Material'] || undefined,
            weight: csvProduct['Variant Weight'] ? parseFloat(csvProduct['Variant Weight']) : undefined,
            length: csvProduct['Variant Length'] ? parseFloat(csvProduct['Variant Length']) : undefined,
            width: csvProduct['Variant Width'] ? parseFloat(csvProduct['Variant Width']) : undefined,
            height: csvProduct['Variant Height'] ? parseFloat(csvProduct['Variant Height']) : undefined,
            allow_backorder: csvProduct['Variant Allow Backorder'] === 'true',
            manage_inventory: true,
            prices,
          },
        ],
        _csvProduct: csvProduct,
      };
    });

    try {
      // Execute the workflow for this batch
      const workflow = createProductsWorkflow(container);
      const workflowResult = await workflow.run({
        input: {
          products: productDataBatch as any,
        },
      });

      const results = workflowResult.result;

      // Set up inventory for each product
      await Promise.all(
        results.map(async (result: any, index: number) => {
          const csvProduct = batch[index];
          const inventoryQuantity = csvProduct['Variant Inventory Quantity']
            ? parseInt(csvProduct['Variant Inventory Quantity'])
            : 10;

          if (result.variants?.[0]?.id && inventoryQuantity > 0) {
            try {
              const inventoryModuleService = container.resolve(Modules.INVENTORY);
              const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);

              const stockLocations = await stockLocationModuleService.listStockLocations({});
              if (stockLocations.length > 0) {
                const stockLocationId = stockLocations[0].id;

                const inventoryItems = await inventoryModuleService.listInventoryItems({
                  sku: csvProduct['Variant SKU'],
                });

                let inventoryItemId;
                if (inventoryItems.length === 0) {
                  const inventoryItem = await inventoryModuleService.createInventoryItems({
                    sku: csvProduct['Variant SKU'] || `sku-${result.variants[0].id}`,
                  });
                  inventoryItemId = inventoryItem.id;
                } else {
                  inventoryItemId = inventoryItems[0].id;
                }

                try {
                  await inventoryModuleService.createInventoryLevels({
                    inventory_item_id: inventoryItemId,
                    location_id: stockLocationId,
                    stocked_quantity: inventoryQuantity,
                  });
                } catch (createError) {
                  await inventoryModuleService.updateInventoryLevels({
                    inventory_item_id: inventoryItemId,
                    location_id: stockLocationId,
                    stocked_quantity: inventoryQuantity,
                  });
                }
              }
            } catch (inventoryError) {
              console.warn(`⚠️ Could not set inventory for ${result.title}:`, inventoryError);
            }
          }
        }),
      );

      successfullyImported += results.length;
      console.log(`✅ Successfully imported ${results.length} products in this batch`);
    } catch (error) {
      console.error('❌ Error importing batch:', error);

      // If it's a SKU duplicate error, try to import products one by one
      if (error.message?.includes('already exists')) {
        console.log(`🔄 Trying to import products individually to skip duplicates...`);

        for (let j = 0; j < productDataBatch.length; j++) {
          const product = productDataBatch[j];
          const csvProduct = batch[j];

          try {
            const workflow = createProductsWorkflow(container);
            const workflowResult = await workflow.run({
              input: {
                products: [product],
              },
            });

            console.log(`✅ Imported: ${product.title}`);
            successfullyImported++;

            // Set up inventory for this individual product
            const result = workflowResult.result[0];
            const inventoryQuantity = csvProduct['Variant Inventory Quantity']
              ? parseInt(csvProduct['Variant Inventory Quantity'])
              : 10;

            if (result.variants?.[0]?.id && inventoryQuantity > 0) {
              try {
                const inventoryModuleService = container.resolve(Modules.INVENTORY);
                const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);

                const stockLocations = await stockLocationModuleService.listStockLocations({});
                if (stockLocations.length > 0) {
                  const stockLocationId = stockLocations[0].id;

                  const inventoryItems = await inventoryModuleService.listInventoryItems({
                    sku: csvProduct['Variant SKU'],
                  });

                  let inventoryItemId;
                  if (inventoryItems.length === 0) {
                    const inventoryItem = await inventoryModuleService.createInventoryItems({
                      sku: csvProduct['Variant SKU'] || `sku-${result.variants[0].id}`,
                    });
                    inventoryItemId = inventoryItem.id;
                  } else {
                    inventoryItemId = inventoryItems[0].id;
                  }

                  try {
                    await inventoryModuleService.createInventoryLevels({
                      inventory_item_id: inventoryItemId,
                      location_id: stockLocationId,
                      stocked_quantity: inventoryQuantity,
                    });
                  } catch (createError) {
                    await inventoryModuleService.updateInventoryLevels({
                      inventory_item_id: inventoryItemId,
                      location_id: stockLocationId,
                      stocked_quantity: inventoryQuantity,
                    });
                  }
                }
              } catch (inventoryError) {
                console.warn(`⚠️ Could not set inventory for ${result.title}:`, inventoryError);
              }
            }
          } catch (individualError) {
            if (individualError.message?.includes('already exists')) {
              console.log(`⏭️  Skipped duplicate: ${product.title} (SKU: ${product.variants[0].sku})`);
              skippedDuplicates++;
            } else {
              console.error(`❌ Failed to import: ${product.title}`, individualError.message);
              failed++;
            }
          }
        }
      } else {
        failed += batch.length;
      }
    }

    // Small delay between batches
    if (i + batchSize < csvProducts.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log('\n🎉 Import completed!');
  console.log(`✅ Successfully imported: ${successfullyImported} products`);
  console.log(`❌ Failed to import: ${failed} products`);
  console.log(`📊 Total processed: ${successfullyImported + failed} products`);
}

// Export as default function for Medusa exec
export default importAllProducts;
