import { createProductTagsWorkflow } from '@medusajs/core-flows';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import type { ExecArgs } from '@medusajs/types';

export default async function seedTags({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  logger.info('Seeding product tags from comprehensive tags list...');

  // Get the product module service to check existing tags
  const productModuleService = container.resolve(Modules.PRODUCT);

  // Comprehensive tags list including existing and new tags
  const allTags = [
    // Brand Tags
    'adelphi',
    'adelphi-research',
    'rohm',
    'rohm-labs',
    'hilma',
    'hilma-biocare',
    'optimum',
    'optimum-biotech',
    'pfizer',
    'pharmaceutical-grade',
    'pharma',

    // Product Type/Form Tags
    'injectable',
    'oral',
    'steroid',
    'blend',
    'liquid',
    'tablets',
    'pen',
    'subcutaneous',
    'intramuscular',

    // Compound/Ingredient Tags - Anabolic Steroids
    'testosterone',
    'test',
    'deca',
    'nandrolone',
    'trenbolone',
    'tren',
    'anavar',
    'oxandrolone',
    'dianabol',
    'methandrostenolone',
    'winstrol',
    'stanozolol',
    'superdrol',
    'methyldrostanolone',
    'turinabol',
    'chlorodehydromethyltestosterone',
    'halotestin',
    'fluoxymesterone',
    'primobolan',
    'primo',
    'methenolone',
    'boldenone',
    'equipoise',
    'masteron',
    'drostanolone',
    'parabolan',
    'oxy',
    'anadrol',
    'oxymetholone',
    'methyl',
    'ment',
    'trestolone',
    'methyltrienolone',
    'proviron',
    'mesterolone',

    // Weight Loss Compounds
    'tirzepatide',
    'retatrutide',
    'clenbuterol',
    'clen',
    't3',
    'liothyronine',
    't4',
    'levothyroxine',
    't5',
    'yohimbine',

    // Growth Hormones
    'hgh',
    'growth-hormone',
    'genotropin',
    'genxtropin',

    // Ester/Form Variants
    'enanthate',
    'propionate',
    'cypionate',
    'acetate',
    'undecylenate',
    'hexahydrobenzylcarbonate',
    'decanoate',
    'phenylpropionate',
    'undecanoate',

    // PCT (Post Cycle Therapy) Tags
    'pct',
    'post-cycle-therapy',
    'clomid',
    'nolvadex',
    'tamoxifen',
    'aromasin',
    'arimidex',
    'exemestane',
    'anastrozole',
    'letrozole',
    'femara',
    'hcg',
    'gonadorelin',
    'estrogen-control',
    'aromatase-inhibitor',
    'serm',
    'ai',
    'hormone-recovery',
    'cycle-support',
    'liver-support',

    // Fat Burner Tags
    'fat-burner',
    'burn',
    'ephedrine',
    'dnp',
    'cardarine',
    'stenabolic',

    // Performance/Effect Tags
    'cutting',
    'bulking',
    'strength',
    'lean-mass',
    'fat-loss',
    'weight-loss',
    'performance',
    'endurance',
    'recovery',
    'anti-estrogen',
    'mass-gain',
    'muscle-building',
    'power',
    'size',
    'anabolic',
    'definition',
    'shredding',
    'thermogenic',
    'athletic-performance',
    'competition-prep',

    // Hormone Optimization
    'trt',
    'testosterone-replacement',
    'hormone-therapy',
    'anti-aging',
    'hormone-optimization',

    // Dosage/Concentration Tags
    '1mg',
    '2mg',
    '2.5mg',
    '10mg',
    '20mg',
    '25mg',
    '30mg',
    '40mg',
    '50mg',
    '100mg',
    '200mg',
    '250mg',
    '300mg',
    '350mg',
    '400mg',
    '500mg',
    'tabs',
    'capsules',
    'ml',
    'vial',
    'ampoule',

    // Popular Compound Combinations
    'sustanon',
    'test-prop',
    'test-e',
    'test-c',
    'tren-a',
    'tren-e',
    'mast-p',
    'mast-e',
    'npp',
    'deca-durabolin',
    'eq',
    'bold',
    'triple-x',
    'rip-blend',
    'mass-blend',
    'test-blend',
    'tren-blend',

    // Experience Level Tags
    'advanced',
    'beginner',
    'intermediate',
    'professional',
    'mild',
    'potent',
    'hardcore',

    // Special Categories
    'bodybuilding',
    'athletics',
    'powerlifting',
    'physique',
    'competition',

    // Quality/Purity Tags
    'lab-tested',
    'premium',
    'high-purity',
    'sterile',
    'ugl',
    'underground-lab',
    'research',
    'compound',
    'peptide',
    'stack',
    'combo',
    'pharmaceutical',
    'research-grade',
    'low-concentration',
    'standard-concentration',
    'high-concentration',
    'ultra-concentrated',

    // Administration Tags
    'daily',
    'weekly',
    'eod',
    'every-other-day',

    // Side Effect Profile Tags
    'mild-sides',
    'low-sides',
    'minimal-sides',
    'harsh',
    'liver-toxic',
    'non-aromatizing',
    'dht-derivative',
    '19-nor',

    // Side Effect Management
    'kidney-support',
    'cardio-protection',
    'joint-support',
    'prostate-support',

    // Stack Tags
    'cycle',
    'solo',
    'combination',
    'synergistic',
    'test-base',
    'kickstart',
    'finisher',
    'bridge',
    'cruise',
    'blast',
    'stack-friendly',
    'standalone',

    // Popular Brand-Specific Tags
    'pharma-grade',
    'research-chemical',

    // Mechanism Tags
    'androgenic',
    'estrogenic',
    'progestogenic',
    'lipolytic',

    // Duration Tags
    'short-ester',
    'long-ester',
    'fast-acting',
    'slow-release',
    'extended-release',

    // Form Factor Tags
    'bottle',
    'blister-pack',
    'pen-injector',
    'pre-filled',
    'multi-dose',
    'single-dose',

    // Medical/Therapeutic Tags
    'anti-inflammatory',
    'neuroprotective',
    'cardioprotective',
    'metabolic',
    'insulin-sensitivity',
    'appetite-stimulant',
    'appetite-suppressant',

    // Seasonal/Timing Tags
    'summer-cut',
    'winter-bulk',
    'pre-contest',
    'off-season',
    'maintenance',
    'recomp',
    'body-recomposition',

    // Special Category Tags - Weight Loss Specific
    'glp1-agonist',
    'incretin-mimetic',
    'diabetes-medication',
    'weight-management',
    'appetite-control',
    'glucose-control',

    // HGH Specific
    'recovery-enhancement',
    'sleep-quality',
    'skin-health',
    'fat-metabolism',
    'muscle-recovery',

    // PCT Specific
    'testosterone-recovery',
    'natural-production',
    'hormone-balance',
    'fertility-support',
    'libido-enhancement',
  ];

  try {
    // Get existing tags from database
    const existingTags = await productModuleService.listProductTags({});
    const existingTagValues = existingTags.map((tag) => tag.value);

    logger.info(`Found ${existingTags.length} existing tags in database`);

    // Filter out tags that already exist
    const newTags = allTags.filter((tag) => !existingTagValues.includes(tag));

    logger.info(`Found ${newTags.length} new tags to create`);

    if (newTags.length === 0) {
      logger.info('All tags already exist in database. No new tags to create.');
      return existingTags;
    }

    // Convert to the format expected by createProductTagsWorkflow
    const productTagsData = newTags.map((tag) => ({ value: tag }));

    const { result: productTagsResult } = await createProductTagsWorkflow(container).run({
      input: {
        product_tags: productTagsData,
      },
    });

    logger.info(`Successfully created ${productTagsResult.length} new product tags`);
    logger.info(`Total tags in database: ${existingTags.length + productTagsResult.length}`);
    logger.info('Tag seeding completed successfully!');

    return [...existingTags, ...productTagsResult];
  } catch (error) {
    logger.error('Error seeding tags:', error);
    throw error;
  }
}
