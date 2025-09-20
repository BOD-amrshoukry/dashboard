import { useTranslation } from 'react-i18next';
import useGetPlans from '../hooks/use-get-plans';
import DataDisplay from '../../../shared/components/data-display';
import Button from '../../../shared/components/button';
import type { Plan } from '../types/types';
import PlanPlan from './plan';
import type { FC } from 'react';

interface PlanInterface {
  setPlan: React.Dispatch<React.SetStateAction<Plan | null>>;
}

const Plans: FC<PlanInterface> = ({ setPlan }) => {
  const { t, i18n } = useTranslation();
  const locale = localStorage.getItem('lang')?.split('-')[0] || 'en';
  const { data, isError, isPending, refetch } = useGetPlans(String(locale));

  console.log('data', data);

  return (
    <DataDisplay
      isLoading={isPending}
      refetch={refetch}
      data={data}
      error={isError ? t('plans.errors.load') : undefined}>
      <div className="grid lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-[24px] mb-[64px]">
        {data?.data.map((plan: Plan) => {
          return <PlanPlan setPlan={setPlan} data={plan} key={plan.id} />;
        })}
      </div>
      <div className="flex items-center gap-[16px] flex-wrap">
        <p>{t('plans.text.stop')}</p>
        <Button link={true} href="mailto:trialbod87@gmail.com">
          {t('plans.text.unsubscribe')}
        </Button>
      </div>
    </DataDisplay>
  );
};

export default Plans;

