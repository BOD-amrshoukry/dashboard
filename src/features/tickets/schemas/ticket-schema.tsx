// features/auth/validation.ts
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const useTicketSchema = () => {
  const { t } = useTranslation();
  const ticketSchema = z.object({
    name: z.string().min(2, t('tickets.errors.name')),
    user: z.number().positive().nullable(),
    state: z
      .enum(['open', 'completed', 'pending'])
      .refine((val) => val !== undefined, {
        message: t('tickets.errors.state'),
      }),
  });

  return { ticketSchema };
};

export default useTicketSchema;

export type TicketFormData = z.infer<
  ReturnType<typeof useTicketSchema>['ticketSchema']
>;

