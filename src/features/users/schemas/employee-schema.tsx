// features/auth/validation.ts
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useEmployeeSchema = () => {
  const { t } = useTranslation();
  const employeeSchema = z.object({
    name: z.string().min(2, t('users.errors.name')),
    username: z.string().min(2, t('users.errors.username')),
    email: z.string().email(t('users.errors.email')),
  });

  return { employeeSchema };
};

export default useEmployeeSchema;

export type EmployeeFormData = z.infer<
  ReturnType<typeof useEmployeeSchema>['employeeSchema']
>;

