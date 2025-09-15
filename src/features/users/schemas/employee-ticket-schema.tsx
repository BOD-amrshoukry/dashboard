// features/auth/validation.ts
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useEmployeeTicketSchema = () => {
  const { t } = useTranslation();
  const employeeTicketSchema = z.object({
    tickets: z.array(z.string(), {
      message: t('tickets.errors.assignOne'),
    }),
  });

  return { employeeTicketSchema };
};

export default useEmployeeTicketSchema;

export type EmployeeTicketFormData = z.infer<
  ReturnType<typeof useEmployeeTicketSchema>['employeeTicketSchema']
>;

