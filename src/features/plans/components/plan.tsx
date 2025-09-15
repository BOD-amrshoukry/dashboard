import React from 'react';
import Button from '../../../shared/components/button';
import { useTranslation } from 'react-i18next';

const Plan = ({ data, setPlan }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-second-background rounded-level1 shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-main-text mb-2">
          {data?.name}
        </h3>
        <p className="text-main-text-helper mb-4">{data?.description}</p>
        {data?.price && (
          <p className="text-2xl font-bold text-main mb-4">${data?.price}</p>
        )}
        <ul className="mb-6 space-y-2">
          {data?.features.features.map((feature) => (
            <li key={feature} className="flex items-center text-main-text">
              <span className="mr-2 text-main font-bold">✓</span> {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        disabled={data?.isActive}
        className="min-w-full justify-self-end"
        onClick={() => setPlan(data)}>
        {data?.isActive ? t('plans.text.current') : t('plans.text.subscribe')}
      </Button>
    </div>
  );
};

export default Plan;

