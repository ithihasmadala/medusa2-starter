import fs from 'fs';
import path from 'path';
import readline from 'readline';
import type { ExecArgs } from '@medusajs/framework/types';

// Utility to parse CSV line
function parseCsvLine(line: string, delimiter = ';') {
  return line.split(delimiter).map((v) => v.trim());
}

// Helper to convert CSV row to object
function csvRowToObject(headers: string[], row: string[]) {
  const obj: any = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  return obj;
}

// Function to clean up product data
function cleanProductData(product: any) {
  // Get the actual product name from CSV - use the correct column name
  const productName = product['Product Title']?.trim() || `Product-${Date.now()}`;

  // Create unique handle
  const baseHandle = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const uniqueHandle = `${baseHandle}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  return {
    title: productName,
    handle: uniqueHandle,
    description: product['Product Subtitle']?.trim() || product['Product Description']?.trim() || '',
    status: product['Product Status']?.trim() || 'published',
    thumbnail: product['Product Thumbnail']?.trim() || null,
    weight: parseFloat(product['Product Weight']?.replace(/[^0-9.]/g, '') || '0'),
    length: parseFloat(product['Product Length']?.replace(/[^0-9.]/g, '') || '0'),
    width: parseFloat(product['Product Width']?.replace(/[^0-9.]/g, '') || '0'),
    height: parseFloat(product['Product Height']?.replace(/[^0-9.]/g, '') || '0'),
    metadata: {
      hs_code: product['Product HS Code']?.trim() || '',
      origin_country: product['Product Origin Country']?.trim() || '',
      mid_code: product['Product MID Code']?.trim() || '',
      material: product['Product Material']?.trim() || '',
      collection_title: product['Product Collection Title']?.trim() || '',
      collection_handle: product['Product Collection Handle']?.trim() || '',
      product_type: product['Product Type']?.trim() || '',
      tags: product['Product Tags']?.trim() || '',
      external_id: product['Product External Id']?.trim() || '',
      original_id: product['Product Id']?.trim() || '',
      variant_sku: product['Variant SKU']?.trim() || '',
      variant_barcode: product['Variant Barcode']?.trim() || '',
      price_gbp: product['Price GBP']?.trim() || '',
      price_eur: product['Price EUR']?.trim() || '',
      price_usd: product['Price USD']?.trim() || '',
      option_1_name: product['Option 1 Name']?.trim() || '',
      option_1_value: product['Option 1 Value']?.trim() || '',
      image_1_url: product['Image 1 Url']?.trim() || '',
      image_2_url: product['Image 2 Url']?.trim() || '',
    },
  };
}

export default async function importProducts({ container }: ExecArgs) {
  console.log('🚀 Starting full product import...');

  try {
    const productService = container.resolve('product');
    console.log('✅ Product service resolved');

    // Read the CSV file
    const csvPath = path.join(process.cwd(), '../buyretatrutideuk-products.csv');
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found: ${csvPath}`);
    }

    console.log('📄 Reading CSV file...');
    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const lines: string[] = [];
    for await (const line of rl) {
      lines.push(line);
    }

    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Parse headers and data
    const headers = parseCsvLine(lines[0]);
    const dataRows = lines.slice(1).map((line) => parseCsvLine(line));

    console.log(`📊 Found ${dataRows.length} products to import`);
    console.log('Headers:', headers);

    // Process products in batches of 5 to avoid overwhelming the system
    const batchSize = 5;
    const batches = [];
    for (let i = 0; i < dataRows.length; i += batchSize) {
      batches.push(dataRows.slice(i, i + batchSize));
    }

    console.log(`🔄 Processing ${batches.length} batches of up to ${batchSize} products each...`);

    let totalCreated = 0;
    let totalFailed = 0;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`\n📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} products)...`);

      const productsToCreate = batch.map((row) => {
        const productObj = csvRowToObject(headers, row);
        return cleanProductData(productObj);
      });

      try {
        const result = await productService.createProducts(productsToCreate);
        console.log(`✅ Batch ${batchIndex + 1} SUCCESS - Created ${result.length} products`);
        totalCreated += result.length;

        // Log a sample of created products
        result.slice(0, 2).forEach((product: any) => {
          console.log(`   - ${product.title} (${product.handle})`);
        });
      } catch (error: any) {
        console.error(`❌ Batch ${batchIndex + 1} FAILED:`, error.message);
        totalFailed += batch.length;

        // Try to create products individually to see which ones fail
        console.log('   🔍 Trying individual creation for this batch...');
        for (const product of productsToCreate) {
          try {
            const singleResult = await productService.createProducts([product]);
            console.log(`   ✅ Individual success: ${product.title}`);
            totalCreated += 1;
            totalFailed -= 1;
          } catch (singleError: any) {
            console.log(`   ❌ Individual failure: ${product.title} - ${singleError.message}`);
          }
        }
      }

      // Small delay between batches to be nice to the system
      if (batchIndex < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log('\n🎉 Import Summary:');
    console.log(`✅ Successfully created: ${totalCreated} products`);
    console.log(`❌ Failed to create: ${totalFailed} products`);
    console.log(`📊 Total processed: ${totalCreated + totalFailed} products`);
  } catch (error: any) {
    console.error('💥 Fatal error during import:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}
