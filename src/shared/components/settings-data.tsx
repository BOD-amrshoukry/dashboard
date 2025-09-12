import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './button';
import clsx from 'clsx';

const SettingsData = ({ setIsOpenModal, setModalData, isAuth = false }) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(
        'flex flex-col',
        isAuth ? 'gap-[16px]' : 'p-4 gap-[16px] ',
      )}>
      <div
        className={clsx('flex flex-col ', isAuth ? 'gap-[16px]' : 'gap-[8px]')}>
        <h2 className="font-medium">{t('settings.text.changeLanguage')}</h2>
        <div
          className={clsx(
            'flex',
            isAuth ? ' gap-[16px]' : ' flex-col gap-[8px]',
          )}>
          <Button
            className={'w-full'}
            variant="inverse"
            onClick={() => {
              setModalData({
                type: 'language',
                value: 'en',

                head: t('settings.text.changeLanguage'),
                description: t('settings.text.changeLanguageModalDescription', {
                  lang: 'English',
                }),
              });
              setIsOpenModal(true);
            }}>
            English
          </Button>
          <Button
            className={'w-full'}
            variant="inverse"
            onClick={() => {
              setModalData({
                type: 'language',
                value: 'ar',
                head: t('settings.text.changeLanguage'),
                description: t('settings.text.changeLanguageModalDescription', {
                  lang: 'العربية',
                }),
              });
              setIsOpenModal(true);
            }}>
            العربية
          </Button>
        </div>
      </div>
      <div
        className={clsx('flex flex-col ', isAuth ? 'gap-[16px]' : 'gap-[8px]')}>
        <h2 className="font-medium">{t('settings.text.changeTheme')}</h2>
        <div
          className={clsx(
            'flex',
            isAuth ? ' gap-[16px]' : ' flex-col gap-[8px]',
          )}>
          <Button
            className={'w-full'}
            variant="inverse"
            onClick={() => {
              setModalData({
                type: 'theme',
                value: 'light',
                head: t('settings.text.changeTheme'),
                description: t('settings.text.changeThemeModalDescription', {
                  theme: t('settings.text.light'),
                }),
              });
              setIsOpenModal(true);
            }}>
            {t('settings.text.light')}
          </Button>
          <Button
            className={'w-full'}
            variant="inverse"
            onClick={() => {
              setModalData({
                type: 'theme',
                value: 'dark',
                head: t('settings.text.changeTheme'),
                description: t('settings.text.changeThemeModalDescription', {
                  theme: t('settings.text.dark'),
                }),
              });
              setIsOpenModal(true);
            }}>
            {t('settings.text.dark')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsData;

