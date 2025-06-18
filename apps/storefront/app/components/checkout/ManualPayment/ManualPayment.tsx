import { Button } from '@app/components/common/buttons';
import { useCheckout } from '@app/hooks/useCheckout';
import { FC } from 'react';

export const ManualPayment: FC = () => {
  const { onPaymentCompleted, paymentInstructions } = useCheckout();

  if (!paymentInstructions) {
    return (
      <div className="flex animate-pulse items-center justify-center">
        <p>Loading payment instructions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div
        className="bg-primary-base/10 text-primary-base rounded-lg p-4"
        dangerouslySetInnerHTML={{ __html: paymentInstructions }}
      />

      <Button onClick={onPaymentCompleted} className="w-full">
        Complete Order
      </Button>
    </div>
  );
};
