// features/auth/validation.ts
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useEditUserSchema = () => {
  const { t } = useTranslation();
  const editUserSchema = z.object({
    name: z.string().min(2, t('profile.errors.name')),
  });

  return { editUserSchema };
};

export default useEditUserSchema;

export type EditUserFormData = z.infer<
  ReturnType<typeof useEditUserSchema>['editUserSchema']
>;

