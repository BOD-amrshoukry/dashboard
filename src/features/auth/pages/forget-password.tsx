import { useTranslation } from 'react-i18next';
import Input from '../../../shared/components/input';
import Button from '../../../shared/components/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import SettingsGuest from '../../../shared/components/settings-guest';
import useForgetPasswordSchema, {
  type ForgetPasswordFormData,
} from '../schemas/forget-password-schema';
import useForgetPassword from '../hooks/use-forget-password';
import TempAuth from '../components/temp-auth';
import { MailCheck } from 'lucide-react';

const ForgetPasswordPage = () => {
  const { t } = useTranslation();
  const { forgetPasswordSchema } = useForgetPasswordSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: ForgetPasswordFormData) => {
    console.log('login data', data);

    mutate(
      { email: data.email },
      {
        onSuccess: (returnedData) => {
          toast.success(t('auth.success.forgetPassword'));
          setStep(2);
        },
        onError: (err) => toast.error(t('auth.errors.forgetPassword')),
      },
    );
  };

  const onInvalid = (errors: any) => {
    console.error('❌ Validation errors:', errors);
  };

  const { isPending, mutate, isError } = useForgetPassword();

  const [step, setStep] = useState(1);

  return (
    <div className="bg-main-background w-full min-h-screen flex">
      <div className="flex-1 min-h-screen container">
        <SettingsGuest />
        <div className="flex justify-center items-center container sm:p-[64px] h-[calc(100vh-56px)]">
          <div className="bg-second-background w-full p-[32px] rounded-level1">
            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <p className="text-[32px] font-bold text-main">
                  {t('auth.text.forgetPassword')}
                </p>
                <p className="text-[14px] text-main-text-helper">
                  {t('auth.text.forgetPasswordDescription')}
                </p>
                <div className="flex flex-col gap-[16px] mt-[32px] mb-[32px]">
                  <Input
                    label={t('auth.text.email')}
                    placeholder={t('auth.text.emailPlaceholder')}
                    type={'email'}
                    {...register('email')}
                    errors={errors}
                    name={'email'}
                    className="w-full"
                    disabled={isPending}
                  />
                </div>
                <Button disabled={isPending} className={'w-full'}>
                  {isPending
                    ? t('general.pending.submitting')
                    : t('general.text.submit')}
                </Button>
                <div className="flex justify-center flex-wrap gap-[16px] mt-[24px]">
                  <Link to={'/login'} className="text-main underline">
                    {t('auth.text.login')}?
                  </Link>
                </div>
              </form>
            )}
            {step === 2 && (
              <TempAuth
                head={t('auth.text.emailSent')}
                icon={<MailCheck size={180} className="text-main" />}
                description={t('auth.text.emailSentDescription')}
                hrefText={t('auth.text.backLogin')}
                href={'/login'}
              />
            )}
          </div>
        </div>
      </div>
      {step === 1 && (
        <div className="flex-1 bg-orange-400 lg:flex hidden">
          <div className="relative w-full h-full">
            <img
              src="/auth/forget.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-main/75 " />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPasswordPage;

