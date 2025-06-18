import { CheckoutContext, CheckoutContextValue, CheckoutStep, useNextStep } from '@app/providers/checkout-provider';
import { FetcherCartKeyPrefix } from '@libs/util/fetcher-keys';
import { StoreOrder } from '@medusajs/types';
import { useContext, useEffect } from 'react';
import { useFetcher, useFetchers, useNavigate } from 'react-router';

const actions = ({ dispatch }: CheckoutContextValue) => ({
  setStep: (step: CheckoutStep) => dispatch({ name: 'setStep', payload: step }),
});

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  const nextStep = useNextStep(context.state);
  const { state } = context;
  const fetchers = useFetchers();
  const cartMutationFetchers = fetchers.filter((f) => f.key.startsWith(FetcherCartKeyPrefix));
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const onPaymentCompleted = () => {
    fetcher.submit({}, { method: 'POST', action: '/api/checkout/complete' });
  };

  useEffect(() => {
    if (fetcher.data) {
      const { success, cart } = fetcher.data as { success: boolean; cart: StoreOrder };
      if (success && cart?.id) {
        // The success page is not able to handle this navigation yet.
        // This will be fixed in a subsequent step.
        navigate(`/checkout/success?order_id=${cart.id}`);
      }
    }
  }, [fetcher.data, navigate]);

  if (!state.step) throw new Error('useCheckout must be used within a CheckoutProvider');

  return {
    ...state,
    ...actions(context),
    goToNextStep: () => context.dispatch({ name: 'setStep', payload: nextStep }),
    isCartMutating: cartMutationFetchers.some((f) => ['loading', 'submitting'].includes(f.state)),
    onPaymentCompleted,
    isCompleting: fetcher.state !== 'idle',
  };
};
