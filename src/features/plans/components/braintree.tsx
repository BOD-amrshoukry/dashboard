import { useQuery } from '@tanstack/react-query';
import dropin from 'braintree-web-drop-in';
import { useEffect, useRef, useState } from 'react';
import Button from '../../../shared/components/button';
import { useTranslation } from 'react-i18next';
import Loading from '../../../shared/components/loading';
import useGetToken from '../hooks/use-get-token';
import usePay from '../hooks/use-pay';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import { useNavigate } from 'react-router-dom';

const BraintreeCheckout = ({ plan, setPlan }) => {
  const { t } = useTranslation();
  const dropinInstance = useRef<any>(null);
  const [dropinReady, setDropinReady] = useState(false); // loading state

  const navigate = useNavigate();

  // Fetch client token using TanStack Query
  const { data, isPending, isError } = useGetToken();

  // Initialize Drop-in when client token is ready
  useEffect(() => {
    if (!data?.clientToken) return;

    dropin.create(
      {
        authorization: data.clientToken,
        container: '#braintree-dropin',
      },
      (err, instance) => {
        if (err) {
          console.error(err);
          return;
        }
        dropinInstance.current = instance;
        setDropinReady(true); // Drop-in is ready
      },
    );

    return () => {
      if (dropinInstance.current) dropinInstance.current.teardown();
    };
  }, [data]);

  const {
    mutate,
    isPending: isPendingPaying,
    isError: isErrorPaying,
  } = usePay();

  const handlePay = async () => {
    if (!dropinInstance.current) return;
    const { nonce } = await dropinInstance.current.requestPaymentMethod();

    mutate(
      {
        nonce,
        amount: plan?.price,
        planId: plan?.planId,
      },
      {
        onSuccess: (returnedData) => {
          toast.success(
            t('plans.success.pay', {
              plan: plan?.name,
            }),
          );
          queryClient.invalidateQueries({ queryKey: ['plans'] });
          setPlan(null);
        },
        onError: (err) => toast.error(t('plans.errors.pay')),
      },
    );

    // const res = await fetch(
    //   'http://localhost:1337/api/plans/braintree/checkout',
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       nonce,
    //       amount: plan?.price,
    //       planId: plan?.planId,
    //     }),
    //   },
    // );
    // const result = await res.json();
    // alert(result.transaction.success ? 'Payment successful' : 'Payment failed');
  };

  // Show query loading or error
  if (isPending) return <Loading />;
  if (isError) return <p className="text-red-500">{t('plans.errors.token')}</p>;

  return (
    <div>
      <div id="braintree-dropin" />

      {!dropinReady && <Loading />}

      <div className="flex gap-4 items-center mt-4">
        <Button
          variant="inverse"
          disabled={isPendingPaying}
          onClick={() => setPlan(null)}>
          {t('general.text.cancel')}
        </Button>
        <Button onClick={handlePay} disabled={!dropinReady || isPendingPaying}>
          {isPendingPaying
            ? t('general.pending.paying')
            : t('general.text.pay')}
        </Button>
      </div>
    </div>
  );
};

export default BraintreeCheckout;

