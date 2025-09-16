import { useState } from 'react';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import SettingsData from '../../../shared/components/settings-data';
import SettingsModal from '../../../shared/components/settings-modal';
import { useTranslation } from 'react-i18next';

type ModalData = {
  type: 'language' | 'theme';
  value: string;
  head: string;
  description: string;
};

const SettingsPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.settings'), href: '/settings' }];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({
    type: 'language', // or "theme"
    value: '', // or the selected theme
    head: '',
    description: '',
  });

  return (
    <>
      <DashboardTopBar breadcrumb={data}></DashboardTopBar>
      <SettingsData
        isAuth={true}
        setIsOpenModal={setIsOpenModal}
        setModalData={setModalData}
      />
      <SettingsModal
        modalData={modalData}
        setIsOpenModal={setIsOpenModal}
        isOpenModal={isOpenModal}
      />
    </>
  );
};

export default SettingsPage;

