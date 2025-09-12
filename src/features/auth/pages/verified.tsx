import { useTranslation } from 'react-i18next';
import SettingsGuest from '../../../shared/components/settings-guest';
import TempAuth from '../components/temp-auth';
import { ShieldCheck } from 'lucide-react';

const VerifiedPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-main-background w-full min-h-screen flex">
      <div className="flex-1 min-h-screen container">
        <SettingsGuest />
        <div className="flex justify-center items-center container sm:p-[64px] h-[calc(100vh-56px)]">
          <div className="bg-second-background w-full p-[32px] rounded-level1">
            <TempAuth
              head={t('auth.text.accountVerified')}
              icon={<ShieldCheck size={180} className="text-main" />}
              description={t('auth.text.accountVerifiedDescription')}
              hrefText={t('auth.text.backReset')}
              href={'/forget-password'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedPage;

