import dropin from 'braintree-web-drop-in';
import { useEffect, useRef } from 'react';

const BraintreeCheckout = () => {
  const dropinInstance = useRef<any>(null);

  useEffect(() => {
    async function init() {
      const res = await fetch(
        'http://localhost:1337/api/plans/braintree/client-token',
      );
      const data = await res.json();

      console.log(data);

      dropin.create(
        {
          authorization: data.clientToken,
          container: '#braintree-dropin',
        },
        (err, instance) => {
          if (err) console.error(err);
          dropinInstance.current = instance;
        },
      );
    }

    init();
  }, []);

  const handlePay = async () => {
    const { nonce } = await dropinInstance.current.requestPaymentMethod();
    const res = await fetch(
      'http://localhost:1337/api/plans/braintree/checkout',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nonce, amount: '10.00', planId: 1 }),
      },
    );
    const data = await res.json();
    alert(data.transaction.success ? 'Payment successful' : 'Payment failed');
  };

  return (
    <div>
      <div id="braintree-dropin"></div>
      <button onClick={handlePay}>Pay</button>
    </div>
  );
};

export default BraintreeCheckout;

