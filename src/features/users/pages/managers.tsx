import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';
import PageHead from '../../../shared/components/page-head';
import PageAction from '../../../shared/components/page-action';
import ManagersTable from '../components/managers-table';

const ManagersPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.managers'), href: '/managers' }];

  return (
    <>
      <DashboardTopBar breadcrumb={data} />
      <div className="flex gap-[24px] items-center mb-[32px]">
        <PageHead head={t('navbar.text.managers')} />
        <PageAction href={'/managers/new'}>+</PageAction>
      </div>
      <ManagersTable />
    </>
  );
};

export default ManagersPage;

