import React, { useState } from 'react';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import SettingsData from '../../../shared/components/settings-data';
import SettingsModal from '../../../shared/components/settings-modal';
import Loading from '../../../shared/components/loading';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.settings'), href: '/settings' }];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

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

