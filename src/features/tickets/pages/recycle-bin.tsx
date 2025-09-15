import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import PageHead from '../../../shared/components/page-head';
import RecycleTable from '../components/recycle-table';

const RecycleBinPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.recycleBin'), href: '/recycle-bin' }];

  return (
    <>
      <DashboardTopBar breadcrumb={data} />
      <div className="flex gap-[24px] items-center mb-[32px]">
        <PageHead head={t('navbar.text.recycleBin')} />
      </div>
      <RecycleTable />
    </>
  );
};

export default RecycleBinPage;

