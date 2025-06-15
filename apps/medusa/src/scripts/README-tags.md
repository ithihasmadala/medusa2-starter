# Product Tags & Types Seeding Scripts

These scripts add comprehensive product tags and types to your Medusa database based on the unique data found in your product export CSV.

## Usage

### Seed Product Tags

To seed all the tags into your database, run:

```bash
cd apps/medusa
yarn seed:tags
```

### Seed Product Types

To seed all the product types into your database, run:

```bash
cd apps/medusa
yarn seed:product-types
```

### Seed Both (Recommended)

To seed both tags and product types:

```bash
cd apps/medusa
yarn seed:tags && yarn seed:product-types
```

Or using npm:

```bash
cd apps/medusa
npm run seed:tags && npm run seed:product-types
```

## What Data Is Added

### Product Tags

The tags script adds **180+ unique tags** organized into the following categories:

### Brand Tags

- `adelphi`, `rohm`

### Product Types

- `injectable`, `oral`, `steroid`, `blend`, `liquid`

### Active Compounds

- `testosterone`, `deca`, `trenbolone`, `anavar`, `dianabol`, `winstrol`, etc.

### Esters

- `enanthate`, `propionate`, `cypionate`, `acetate`, etc.

### PCT (Post Cycle Therapy)

- `pct`, `clomid`, `nolvadex`, `aromasin`, `arimidex`, etc.

### Fat Burners

- `clenbuterol`, `t3`, `t4`, `yohimbine`, etc.

### Performance Categories

- `cutting`, `bulking`, `strength`, `lean-mass`, `fat-loss`, etc.

### Dosage Tags

- `100mg`, `200mg`, `250mg`, `10mg`, `20mg`, etc.

### Administration Tags

- `intramuscular`, `subcutaneous`, `daily`, `weekly`, etc.

### Quality Tags

- `pharmaceutical-grade`, `lab-tested`, `premium`, etc.

### Product Types

The product types script adds **4 main product categories**:

- **Injectable Steroids** - For all injectable steroid products
- **Oral Steroids** - For all oral steroid products
- **Fat Burners** - For fat burning and cutting products
- **PCT** - For Post Cycle Therapy products

## How It Works

The scripts use Medusa's workflows to batch create all data:

### Tags Script

Uses `createProductTagsWorkflow` to batch create all tags. It:

1. Defines all unique tags found in your CSV data
2. Adds additional relevant tags for better product categorization
3. Creates all tags in a single transaction
4. Provides logging for success/failure

### Product Types Script

Uses `createProductTypesWorkflow` to create product types. It:

1. Defines the 4 main product type categories from your CSV
2. Creates all product types in a single transaction
3. Provides logging with the new type IDs for reference

## Error Handling

Both scripts include proper error handling and will:

- Log progress during execution
- Handle duplicate entries gracefully (Medusa prevents duplicates)
- Provide detailed error messages if something goes wrong

## After Running

Once the tags and product types are created, you can:

1. **Tags**: Use them when creating new products, assign to existing products, use for filtering and search
2. **Product Types**: Assign to products for better categorization and organization
3. Reference both in your storefront for enhanced product browsing
4. Use them in your admin dashboard for product management

## Note

Both scripts are safe to run multiple times - Medusa will handle duplicate values gracefully.
