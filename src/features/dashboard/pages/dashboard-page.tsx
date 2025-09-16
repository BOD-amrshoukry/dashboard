import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';
import Charts from '../components/charts';

const DashboardPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.dashboard'), href: '/dashboard' }];

  return (
    <>
      <DashboardTopBar breadcrumb={data}></DashboardTopBar>
      <Charts />
    </>
  );
};

export default DashboardPage;

