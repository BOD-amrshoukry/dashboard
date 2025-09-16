import Modal from './modal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from './button';

type ModalData = {
  type: 'language' | 'theme';
  value: string;
  head: string;
  description: string;
};

const SettingsModal = ({
  modalData,
  setIsOpenModal,
  isOpenModal,
}: {
  modalData: ModalData;
  setIsOpenModal: (open: boolean) => void;
  isOpenModal: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    toast.success(t('settings.success.languageChange'));
    setIsOpenModal(false);
  };

  const handleChangeTheme = (theme: string) => {
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
              : handleChangeTheme(String(modalData?.value))
          }>
          {t('general.text.change')}
        </Button>
      </div>
    </Modal>
  );
};

export default SettingsModal;

