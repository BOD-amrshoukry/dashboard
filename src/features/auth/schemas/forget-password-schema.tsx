// features/auth/validation.ts
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useForgetPasswordSchema = () => {
  const { t } = useTranslation();
  const forgetPasswordSchema = z.object({
    email: z.string().email(t('auth.errors.email')),
  });

  return { forgetPasswordSchema };
};

export default useForgetPasswordSchema;

export type ForgetPasswordFormData = z.infer<
  ReturnType<typeof useForgetPasswordSchema>['forgetPasswordSchema']
>;

