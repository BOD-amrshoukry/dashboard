import TempAuth from '../../features/auth/components/temp-auth';
import { useTranslation } from 'react-i18next';
import { CircleX } from 'lucide-react';
import SettingsGuest from '../components/settings-guest';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-main-background w-full min-h-screen flex">
      <div className="flex-1 min-h-screen container">
        <SettingsGuest />
        <div className="flex justify-center items-center container sm:p-[64px] h-[calc(100vh-56px)]">
          <div className="bg-second-background w-full p-[32px] rounded-level1">
            <TempAuth
              description={t('notFound.text.description')}
              head={t('notFound.text.head')}
              href={'/dashboard'}
              hrefText={t('notFound.text.backHome')}
              icon={<CircleX size={180} className="text-main" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

