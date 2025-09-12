import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useResetPasswordSchema = () => {
  const { t } = useTranslation();

  const resetPasswordSchema = z
    .object({
      password: z.string().min(6, t('auth.errors.password')), // validate password length
      passwordConfirmation: z
        .string()
        .min(6, t('auth.errors.confirmationPassword')),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t('auth.errors.confirmationPassword'),
      path: ['passwordConfirmation'],
    });

  return { resetPasswordSchema };
};

export default useResetPasswordSchema;

export type ResetPasswordFormData = z.infer<
  ReturnType<typeof useResetPasswordSchema>['resetPasswordSchema']
>;

