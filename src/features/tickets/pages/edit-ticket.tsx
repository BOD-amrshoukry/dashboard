import { useTranslation } from 'react-i18next';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import PageHead from '../../../shared/components/page-head';
import TicketForm from '../components/ticket-form';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCreateOrUpdateTicket from '../hooks/use-create-or-edit-ticket';
import { queryClient } from '../../../lib/tanstackquery';
import useGetTicket from '../hooks/use-get-ticket';
import DataDisplay from '../../../shared/components/data-display';

const EditTicketPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateOrUpdateTicket();

  console.log('id', id);

  const { data, isError, isPending: isLoading } = useGetTicket(id);

  const handleSubmit = (formData: any) => {
    mutate(
      { id: id, data: formData },
      {
        onSuccess: () => {
          toast.success(t('tickets.success.edit'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          navigate(`/tickets/${id}`);
        },
        onError: () => toast.error(t('tickets.errors.edit')),
      },
    );
  };

  const onInvalid = (error) => {
    console.log(error);
  };

  const defaultValues = {
    name: data?.data?.name,
    state: data?.data?.state,
    user: data?.data?.user?.id || null,
  };

  return (
    <>
      <DashboardTopBar
        isPending={isLoading}
        breadcrumb={[
          { label: t('navbar.text.tickets'), href: '/tickets' },
          { label: data?.data?.name || id, href: `/tickets/${id}` },
          { label: t('general.text.edit'), href: `/tickets/${id}/edit` },
        ]}
      />
      <DataDisplay
        data={data}
        isLoading={isLoading}
        error={isError ? t('tickets.errors.loadOne') : undefined}>
        <PageHead
          head={`${t('general.text.edit')} ${t('tickets.text.ticket')} (${
            data?.data?.name
          })`}
        />

        <div className="mt-[32px]">
          <TicketForm
            type="edit"
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isPending={isPending}
            submitLabel={t('general.text.update')}
            userValue={data?.data?.user}
            onInvalid={onInvalid}
          />
        </div>
      </DataDisplay>
    </>
  );
};

export default EditTicketPage;

