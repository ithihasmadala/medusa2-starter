import { sdk } from '@libs/util/server/client.server';
import { StorePaymentProvider } from '@medusajs/types';

export const listCartPaymentProviders = async (regionId: string) => {
  return sdk.store.payment
    .listPaymentProviders({ region_id: regionId })
    .then(({ payment_providers }) => payment_providers)
    .catch(() => [] as StorePaymentProvider[]);
};

export const fetchPaymentInstructions = async () => {
  try {
    const baseUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const response = await fetch(`${baseUrl}/store/payment-instructions`);
    const { instructions } = await response.json();
    return instructions;
  } catch (error) {
    console.error('Failed to fetch payment instructions:', error);
    return null;
  }
};
