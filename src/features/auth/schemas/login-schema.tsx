// features/auth/validation.ts
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useLoginSchema = () => {
  const { t } = useTranslation();
  const loginSchema = z.object({
    email: z.string().email(t('auth.errors.email')),
    password: z.string().min(6, t('auth.errors.password')),
    rememberMe: z.boolean(),
  });

  return { loginSchema };
};

export default useLoginSchema;

export type LoginFormData = z.infer<
  ReturnType<typeof useLoginSchema>['loginSchema']
>;

