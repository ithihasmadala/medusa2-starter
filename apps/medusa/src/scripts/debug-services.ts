import type { ExecArgs } from '@medusajs/framework/types';

export default async function debugServices({ container }: ExecArgs) {
  console.log('🔍 Debugging available services...');

  try {
    // Get all services
    const containerRegistry = (container as any).cradle || {};
    const serviceNames = Object.keys(containerRegistry);

    console.log('📊 Total services available:', serviceNames.length);

    // Look for sales channel related services
    const salesChannelServices = serviceNames.filter(
      (name) => name.toLowerCase().includes('sales') || name.toLowerCase().includes('channel'),
    );
    console.log('📦 Sales channel related services:', salesChannelServices);

    // Try different service names
    const possibleNames = ['salesChannel', 'sales-channel', 'salesChannelService', 'sales_channel'];

    for (const name of possibleNames) {
      try {
        const service = container.resolve(name);
        console.log(`✅ Found service: ${name}`);
        console.log(
          `   Methods:`,
          Object.getOwnPropertyNames(Object.getPrototypeOf(service)).filter((m) => typeof service[m] === 'function'),
        );
      } catch (error) {
        console.log(`❌ Service not found: ${name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error debugging services:', error);
  }
}
