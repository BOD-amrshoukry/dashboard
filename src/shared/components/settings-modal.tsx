import React, { useState } from 'react';
import Modal from './modal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from './button';

const SettingsModal = ({ modalData, setIsOpenModal, isOpenModal }) => {
  const { t, i18n } = useTranslation();
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    toast.success(t('settings.success.languageChange'));
    setIsOpenModal(false);
  };

  const handleChangeTheme = (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    toast.success(t('settings.success.themeChange'));
    setIsOpenModal(false);
  };

  return (
    <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
      <h2 className="text-xl font-bold mb-4">{modalData?.head}</h2>
      <p>{modalData?.description}</p>
      <div className="flex gap-[16px] mt-[24px] flex-col sm:flex-row">
        <Button
          onClick={() => setIsOpenModal(false)}
          className={'w-full'}
          variant="inverse">
          {t('general.text.cancel')}
        </Button>
        <Button
          className={'w-full'}
          onClick={() =>
            modalData?.type === 'language'
              ? handleChangeLanguage(modalData?.value)
              : handleChangeTheme(modalData?.value)
          }>
          {t('general.text.change')}
        </Button>
      </div>
    </Modal>
  );
};

export default SettingsModal;

