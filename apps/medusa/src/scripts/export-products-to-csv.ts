import fs from 'fs';
import path from 'path';

// Utility to pick a random element from an array
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Utility to extract weight from product name (returns mg as number)
function extractWeight(name: string): number {
  const match = name.match(/(\d+)(mg|g)/i);
  if (match) {
    let value = parseInt(match[1], 10);
    if (match[2].toLowerCase() === 'g') {
      value = value * 1000;
    }
    return value;
  }
  return 100; // default to 100mg
}

// Utility to slugify product handle
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Read text files
const assetsDir = path.resolve(__dirname, '../../../../assets');
const adelphiFile = path.join(assetsDir, 'adelphi-product-list.txt');
const rohmFile = path.join(assetsDir, 'rohm-product-list.txt');
const catColFile = path.join(assetsDir, 'categories-and-collections.txt');

const adelphiText = fs.readFileSync(adelphiFile, 'utf8');
const rohmText = fs.readFileSync(rohmFile, 'utf8');
const catColText = fs.readFileSync(catColFile, 'utf8');

// Parse categories and collections from mapping file
function parseCategoriesAndCollections(text: string) {
  const categories: Record<string, string> = {};
  const collections: Record<string, string> = {};
  // Parse collections
  const collectionRegex = /\d+\. ([^\n]+)\n\s+- Handle: ([^\n]+)/g;
  let match;
  while ((match = collectionRegex.exec(text))) {
    collections[match[1].trim()] = match[2].trim();
  }
  // Parse parent and subcategories
  const parentCatRegex = /\*\*([\w\s]+)\*\*\n\s+- Handle: ([^\n]+)\n\s+- Subcategories:([\s\S]*?)(?=\n\d+\. |$)/g;
  while ((match = parentCatRegex.exec(text))) {
    const parent = match[1].trim();
    const handle = match[2].trim();
    categories[parent] = handle;
    // Subcategories
    const subcatBlock = match[3];
    const subcatRegex = /• ([^\n]+)/g;
    let subMatch;
    while ((subMatch = subcatRegex.exec(subcatBlock))) {
      const subcat = subMatch[1].trim();
      categories[subcat] = slugify(subcat);
    }
  }
  return { categories, collections };
}

const { categories, collections } = parseCategoriesAndCollections(catColText);

// Parse product lists (returns array of { brand, name, description, subcategory, parentCategory })
function parseProductList(text: string, brand: 'Adelphi' | 'Rohm') {
  const products: any[] = [];
  let currentSubcat = '';
  let currentParent = brand === 'Adelphi' ? 'Adelphi Research' : 'Rohm Labs';
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('####')) {
      currentSubcat = line.replace(/####\s*/, '');
    } else if (line.startsWith('- **')) {
      // Product line
      const nameMatch = line.match(/\*\*(.+)\*\*/);
      const desc = line.split(' - ')[1] || '';
      if (nameMatch) {
        products.push({
          brand,
          name: nameMatch[1].trim(),
          description: desc.trim(),
          subcategory: currentSubcat,
          parentCategory: currentParent,
        });
      }
    } else if (line.startsWith('### Main Category:')) {
      currentParent = line.replace('### Main Category:', '').trim();
    }
  }
  return products;
}

const adelphiProducts = parseProductList(adelphiText, 'Adelphi');
const rohmProducts = parseProductList(rohmText, 'Rohm');
const allProducts = [...adelphiProducts, ...rohmProducts];

// CSV header (from product-import-template.csv, with Price GBP added)
const csvHeader = [
  'Product Id',
  'Product Handle',
  'Product Title',
  'Product Subtitle',
  'Product Description',
  'Product Status',
  'Product Thumbnail',
  'Product Weight',
  'Product Length',
  'Product Width',
  'Product Height',
  'Product HS Code',
  'Product Origin Country',
  'Product MID Code',
  'Product Material',
  'Product Collection Title',
  'Product Collection Handle',
  'Product Type',
  'Product Tags',
  'Product Discountable',
  'Product External Id',
  'Product Profile Name',
  'Product Profile Type',
  'Variant Id',
  'Variant Title',
  'Variant SKU',
  'Variant Barcode',
  'Variant Inventory Quantity',
  'Variant Allow Backorder',
  'Variant Manage Inventory',
  'Variant Weight',
  'Variant Length',
  'Variant Width',
  'Variant Height',
  'Variant HS Code',
  'Variant Origin Country',
  'Variant MID Code',
  'Variant Material',
  'Price EUR',
  'Price USD',
  'Price GBP',
  'Option 1 Name',
  'Option 1 Value',
  'Image 1 Url',
  'Image 2 Url',
];

// Generate CSV rows
const rows: string[][] = [];

allProducts.forEach((prod, idx) => {
  // Generate handle
  const handle = slugify(prod.name);
  // Assign collection and category
  const collectionTitle = prod.parentCategory;
  const collectionHandle = collections[collectionTitle] || slugify(collectionTitle);
  const category = prod.subcategory && categories[prod.subcategory] ? prod.subcategory : prod.parentCategory;
  const categoryHandle = categories[category] || slugify(category);
  // Image
  const imageUrl =
    prod.brand === 'Adelphi'
      ? 'https://omnicomhealthgroup.com/wp-content/uploads/2024/09/adelphi.png'
      : 'https://www.rohmlab.com/assets/images/labs.svg';
  // Variant
  const variantTitle = 'Default';
  const sku = `${handle.toUpperCase()}-SKU`;
  const barcode = '';
  const inventoryQty = 100;
  const allowBackorder = 'false';
  const manageInventory = 'true';
  // Weight
  const weight = extractWeight(prod.name);
  // Prices
  const gbp = randomChoice([30, 40, 50]);
  const gbpMinor = gbp * 100;
  const usd = gbp * 1.2 * 100; // rough conversion
  const eur = gbp * 1.1 * 100; // rough conversion
  // CSV row
  const row = [
    '', // Product Id
    handle, // Product Handle
    prod.name, // Product Title
    '', // Product Subtitle
    prod.description, // Product Description
    'published', // Product Status
    imageUrl, // Product Thumbnail
    weight.toString(), // Product Weight (mg)
    '', // Product Length
    '', // Product Width
    '', // Product Height
    '', // Product HS Code
    'GB', // Product Origin Country
    '', // Product MID Code
    '', // Product Material
    collectionTitle, // Product Collection Title
    collectionHandle, // Product Collection Handle
    category, // Product Type (using category)
    '', // Product Tags
    'true', // Product Discountable
    '', // Product External Id
    '', // Product Profile Name
    '', // Product Profile Type
    '', // Variant Id
    variantTitle, // Variant Title
    sku, // Variant SKU
    barcode, // Variant Barcode
    inventoryQty.toString(), // Variant Inventory Quantity
    allowBackorder, // Variant Allow Backorder
    manageInventory, // Variant Manage Inventory
    weight.toString(), // Variant Weight
    '', // Variant Length
    '', // Variant Width
    '', // Variant Height
    '', // Variant HS Code
    'GB', // Variant Origin Country
    '', // Variant MID Code
    '', // Variant Material
    Math.round(eur).toString(), // Price EUR (minor units)
    Math.round(usd).toString(), // Price USD (minor units)
    gbpMinor.toString(), // Price GBP (minor units)
    '', // Option 1 Name
    '', // Option 1 Value
    imageUrl, // Image 1 Url
    '', // Image 2 Url
  ];
  rows.push(row);
});

// Write CSV
const csvPath = path.resolve(__dirname, '../../../buyretatrutideuk-products.csv');
const csvContent = [csvHeader.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log(`Exported ${rows.length} products to ${csvPath}`);
