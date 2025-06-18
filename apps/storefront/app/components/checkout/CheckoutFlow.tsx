import { Alert } from '@app/components/common/alert/Alert';
import { useCheckout } from '@app/hooks/useCheckout';
import { useCustomer } from '@app/hooks/useCustomer';
import { FC, useEffect, useState } from 'react';
import { CheckoutAccountDetails } from './CheckoutAccountDetails';
import { CheckoutDeliveryMethod } from './CheckoutDeliveryMethod';
import { ManualPayment } from './ManualPayment/ManualPayment';
import { StripePayment } from './StripePayment';

export const CheckoutFlow: FC = () => {
  const { customer } = useCustomer();
  const { goToNextStep, cart, paymentProviders } = useCheckout();
  const isLoggedIn = !!customer?.id;
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'manual'>(
    paymentProviders.some((p) => p.id === 'stripe') ? 'stripe' : 'manual',
  );

  if (!cart) return;

  useEffect(() => {
    if (isLoggedIn) goToNextStep();
    return () => goToNextStep();
  }, [isLoggedIn]);

  const manualPaymentProvider = paymentProviders.find((p) => p.id === 'manual');
  const stripePaymentProvider = paymentProviders.find((p) => p.id === 'stripe');

  return (
    <>
      <div className="lg:min-h-[calc(100vh-320px)] lg:pl-8">
        {isLoggedIn && (
          <Alert type="info" className="mb-8">
            Checking out as:{' '}
            <strong className="font-bold">
              {customer.first_name} {customer.last_name} ({customer.email})
            </strong>
          </Alert>
        )}

        <CheckoutAccountDetails />

        <hr className="my-10" />

        <CheckoutDeliveryMethod />

        <div>
          <div className="my-4 flex flex-col gap-y-4">
            {stripePaymentProvider && (
              <label className="flex items-center gap-x-4 rounded-lg border p-4">
                <input
                  type="radio"
                  name="payment_method"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                />
                Stripe
              </label>
            )}
            {manualPaymentProvider && (
              <label className="flex items-center gap-x-4 rounded-lg border p-4">
                <input
                  type="radio"
                  name="payment_method"
                  value="manual"
                  checked={paymentMethod === 'manual'}
                  onChange={() => setPaymentMethod('manual')}
                />
                Payment Instructions
              </label>
            )}
          </div>
        </div>

        {paymentMethod === 'manual' && manualPaymentProvider && <ManualPayment />}
      </div>
    </>
  );
};
