import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useCreateOrEditManager from '../hooks/use-create-or-edit-manager';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import PageHead from '../../../shared/components/page-head';
import ManagerForm from '../components/manager-form';

const NewManagerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateOrEditManager();

  const handleSubmit = (formData: any) => {
    mutate(
      { data: formData },
      {
        onSuccess: (returnedData) => {
          queryClient.invalidateQueries({ queryKey: ['managers'] });
          const id = returnedData.user.id;
          toast.success(t('users.success.create'));
          navigate(`/managers/${id}`);
        },
        onError: () => toast.error(t('users.errors.create')),
      },
    );
  };

  const onInvalid = (error) => {
    console.log(error);
  };

  return (
    <>
      <DashboardTopBar
        breadcrumb={[
          { label: t('navbar.text.managers'), href: '/managers' },
          { label: t('general.text.new'), href: `/managers/new` },
        ]}
      />
      <PageHead head={`${t('general.text.new')} ${t('users.text.manager')}`} />

      <div className="mt-[32px]">
        <ManagerForm
          type="new"
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={t('general.text.create')}
          onInvalid={onInvalid}
        />
      </div>
    </>
  );
};

export default NewManagerPage;

