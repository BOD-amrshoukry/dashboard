// features/auth/validation.ts
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useManagerSchema = () => {
  const { t } = useTranslation();
  const managerSchema = z.object({
    name: z.string().min(2, t('users.errors.name')),
    username: z.string().min(2, t('users.errors.username')),
    email: z.string().email(t('users.errors.email')),
  });

  return { managerSchema };
};

export default useManagerSchema;

export type ManagerFormData = z.infer<
  ReturnType<typeof useManagerSchema>['managerSchema']
>;

