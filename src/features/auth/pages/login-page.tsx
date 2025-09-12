import { useTranslation } from 'react-i18next';
import Input from '../../../shared/components/input';
import Button from '../../../shared/components/button';
import { useForm } from 'react-hook-form';
import type { LoginFormData } from '../schemas/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import useLoginSchema from '../schemas/login-schema';
import Checkbox from '../../../shared/components/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '../hooks/use-login';
import toast from 'react-hot-toast';
import { useState } from 'react';
import SettingsGuest from '../../../shared/components/settings-guest';
import { setCookie } from '../../../shared/utils/auth';

const LoginPage = () => {
  const { t } = useTranslation();
  const { loginSchema } = useLoginSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false, // initial value
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: LoginFormData) => {
    console.log('login data', data);

    mutate(
      { identifier: data.email, password: data.password },
      {
        onSuccess: (returnedData) => {
          setCookie(
            'token',
            returnedData.jwt,
            data.rememberMe ? 30 : undefined,
          );
          toast.success(t('auth.success.login'));
          navigate('/dashboard');
        },
        onError: (err) => toast.error(t('auth.errors.login')),
      },
    );
  };

  const onInvalid = (errors: any) => {
    console.error('❌ Validation errors:', errors);
  };

  const { isPending, mutate, isError } = useLogin();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-main-background w-full min-h-screen flex">
      <div className="flex-1 min-h-screen container">
        <SettingsGuest />
        <div className="flex justify-center items-center container sm:p-[64px] h-[calc(100vh-56px)]">
          <div className="bg-second-background w-full p-[32px] rounded-level1">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
              <p className="text-[32px] font-bold text-main">
                {t('auth.text.login')}
              </p>
              <p className="text-[14px] text-main-text-helper">
                {t('auth.text.loginDescription')}
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

                <Input
                  label={t('auth.text.password')}
                  placeholder={t('auth.text.passwordPlaceholder')}
                  type={'password'}
                  {...register('password')}
                  errors={errors}
                  name={'password'}
                  className="w-full"
                  disabled={isPending}
                />

                <div className="flex justify-between flex-wrap gap-[16px]">
                  <Checkbox
                    {...register('rememberMe')}
                    disabled={isPending}
                    label={t('auth.text.rememberMe')}
                  />

                  <Link to={'/forget-password'} className="text-main underline">
                    {t('auth.text.forgetPassword')}?
                  </Link>
                </div>
              </div>
              <Button disabled={isPending} className={'w-full'}>
                {isPending ? t('auth.pending.logging') : t('auth.text.login')}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-orange-400 lg:flex hidden">
        <div className="relative w-full h-full">
          <img
            src="/auth/login.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-main/75 " />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

