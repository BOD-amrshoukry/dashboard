import { useTranslation } from 'react-i18next';
import Input from '../../../shared/components/input';
import Button from '../../../shared/components/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import SettingsGuest from '../../../shared/components/settings-guest';
import useResetPasswordSchema, {
  type ResetPasswordFormData,
} from '../schemas/reset-password-schema';
import useResetPassword from '../hooks/use-reset-password';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPasswordSchema } = useResetPasswordSchema();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code'); // "9049e26ff9b6c5f3d24b37edd"

  console.log('CODE', code);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log('login data', data);

    mutate(
      {
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        code: code,
      },
      {
        onSuccess: (returnedData) => {
          toast.success(t('auth.success.resetPassword'));
          navigate('/login');
        },
        onError: (err) => toast.error(t('auth.errors.resetPassword')),
      },
    );
  };

  const onInvalid = (errors: any) => {
    console.error('❌ Validation errors:', errors);
  };

  const { isPending, mutate, isError } = useResetPassword();

  return (
    <div className="bg-main-background w-full min-h-screen flex">
      <div className="flex-1 min-h-screen container pb-[32px]">
        <SettingsGuest />
        <div className="flex justify-center items-center container sm:p-[64px] min-h-[calc(100vh-56px)]">
          <div className="bg-second-background w-full p-[32px] rounded-level1">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
              <p className="text-[32px] font-bold text-main">
                {t('auth.text.resetPassword')}
              </p>
              <p className="text-[14px] text-main-text-helper">
                {t('auth.text.resetPasswordDescription')}
              </p>
              <div className="flex flex-col gap-[16px] mt-[32px] mb-[32px]">
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

                <Input
                  label={t('auth.text.passwordConfirmation')}
                  placeholder={t('auth.text.passwordConfirmationPlaceholder')}
                  type={'password'}
                  {...register('passwordConfirmation')}
                  errors={errors}
                  name={'passwordConfirmation'}
                  className="w-full"
                  disabled={isPending}
                />
              </div>
              <Button disabled={isPending} className={'w-full'}>
                {isPending ? t('auth.pending.reseting') : t('auth.text.reset')}
              </Button>

              <div className="flex justify-center flex-wrap gap-[16px] mt-[32px]">
                <Link to={'/login'} className="text-main underline">
                  {t('auth.text.login')}?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-orange-400 lg:flex hidden">
        <div className="relative w-full h-full">
          <img
            src="/auth/reset.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-main/75 " />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

