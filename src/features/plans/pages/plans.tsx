import { useTranslation } from 'react-i18next';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import Plans from '../components/plans';
import PageHead from '../../../shared/components/page-head';
import { useState } from 'react';
import BraintreeCheckout from '../components/braintree';

const PlansPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.plans'), href: '/plans' }];
  const [plan, setPlan] = useState(null);

  return (
    <>
      <DashboardTopBar breadcrumb={data} />
      <PageHead head={`${plan ? plan?.name : t('navbar.text.plans')}`} />
      <div className="mt-[32px]">
        {plan ? (
          <BraintreeCheckout setPlan={setPlan} plan={plan} />
        ) : (
          <Plans setPlan={setPlan} />
        )}
      </div>
    </>
  );
};

export default PlansPage;

