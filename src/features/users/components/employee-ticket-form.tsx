import { useTranslation } from 'react-i18next';
import useEmployeeTicketSchema, {
  type EmployeeTicketFormData,
} from '../schemas/employee-ticket-schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAssignTickets from '../../tickets/hooks/use-assign-tickets';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import Button from '../../../shared/components/button';
import PaginatedDatalist from '../../../shared/components/paginated-datalist';
import { fetchTickets } from '../../tickets/services/get';
import { useEffect } from 'react';
import useSendNotification from '../../notifications/hooks/use-send-notification';
import { useSocket } from '../../../hooks/use-socket';

const EmployeeTicketForm = ({ isEnabled, setIsEnabled }) => {
  const { t } = useTranslation();
  const { employeeTicketSchema } = useEmployeeTicketSchema();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EmployeeTicketFormData>({
    resolver: zodResolver(employeeTicketSchema),
    defaultValues: {
      tickets: [],
    },
  });

  const { mutate: sendNotification } = useSendNotification();
  const { socket } = useSocket();

  const onSubmit = (data: EmployeeTicketFormData) => {
    mutate(
      { ids: data.tickets, userId: id },
      {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.assign'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          queryClient.invalidateQueries({ queryKey: ['employees'] });
          setIsEnabled(false);
          if (id) {
            sendNotification({
              userId: id,
              title: t('notifications.text.assignManyHead'),
              message: t('notifications.text.assignManyDescription'),
            });
            if (socket) {
              socket.emit('sendNotification', {
                recipientId: id,
                data: {
                  title: t('notifications.text.assignManyHead'),
                  message: t('notifications.text.assignManyDescription'),
                },
              });
            }
          }
        },
        onError: (err) => toast.error(t('tickets.errors.assign')),
      },
    );
  };

  const onInvalid = (errors: any) => {
    console.error('❌ Validation errors:', errors);
  };

  const { isPending, mutate, isError } = useAssignTickets();

  if (!isEnabled) return null;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className=" flex flex-col mt-[16px] mb-[32px] items-start gap-[16px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Controller
              name="tickets"
              control={control}
              render={({ field }) => (
                <PaginatedDatalist
                  idKey="documentId"
                  label={t('tickets.text.tickets')}
                  placeholder={t('tickets.text.ticketsPlaceholder')}
                  multiple={true}
                  queryKey="employees"
                  fetchFunction={(params) =>
                    fetchTickets(params, { unAssigned: true })
                  }
                  itemKey="name"
                  errors={errors}
                  name="tickets"
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="flex items-center gap-[16px] flex-wrap">
            <Button
              disabled={isPending}
              variant="inverse"
              onClick={() => setIsEnabled(false)}>
              {t('general.text.cancel')}
            </Button>

            <Button disabled={isPending || !isDirty}>
              {isPending
                ? t('general.pending.assigning')
                : t('general.text.assign')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeTicketForm;

