import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';
import PageHead from '../../../shared/components/page-head';
import PageAction from '../../../shared/components/page-action';
import { useNavigate } from 'react-router-dom';
import TicketsTable from '../components/tickets-table';

const TicketsPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.tickets'), href: '/tickets' }];

  return (
    <>
      <DashboardTopBar breadcrumb={data} />
      <div className="flex gap-[24px] items-center mb-[32px]">
        <PageHead head={t('navbar.text.tickets')} />
        <PageAction href={'/tickets/new'}>+</PageAction>
      </div>
      <TicketsTable />
    </>
  );
};

export default TicketsPage;

