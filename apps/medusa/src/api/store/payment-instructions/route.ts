import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { paymentInstructions } from '../../../data/payment-instructions';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.status(200).json({ instructions: paymentInstructions });
} 