import { useTranslation } from 'react-i18next';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import PageHead from '../../../shared/components/page-head';
import PageAction from '../../../shared/components/page-action';
import EmployeesTable from '../components/employees-table';

const EmployeesPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.employees'), href: '/employees' }];

  return (
    <>
      <DashboardTopBar breadcrumb={data} />
      <div className="flex gap-[24px] items-center mb-[32px]">
        <PageHead head={t('navbar.text.employees')} />
        <PageAction href={'/employees/new'}>+</PageAction>
      </div>
      <EmployeesTable />
    </>
  );
};

export default EmployeesPage;

