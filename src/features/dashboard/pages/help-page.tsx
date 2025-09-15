import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';
import PageHead from '../../../shared/components/page-head';
import HelpVideo from '../components/help-video';

const HelpPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.help'), href: '/help' }];

  return (
    <>
      <DashboardTopBar breadcrumb={data}></DashboardTopBar>
      <PageHead head={`${t('help.text.head')}`} />
      <div className="mt-[32px]">
        <HelpVideo />
      </div>
    </>
  );
};

export default HelpPage;

