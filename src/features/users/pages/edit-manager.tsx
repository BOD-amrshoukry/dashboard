import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useCreateOrEditManager from '../hooks/use-create-or-edit-manager';
import useGetManager from '../hooks/use-get-manager';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import DataDisplay from '../../../shared/components/data-display';
import PageHead from '../../../shared/components/page-head';
import ManagerForm from '../components/manager-form';
import UserImage from '../../../shared/components/user-image';
import useDeleteImage from '../hooks/use-delete-image';
import useUpdateImage from '../hooks/use-update-image';
import { BASE_URL } from '../../../shared/constants/api';

const EditManagerPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateOrEditManager();

  const { data, isError, isPending: isLoading } = useGetManager(id);

  const handleSubmit = (formData: any) => {
    mutate(
      { id: id, data: formData },
      {
        onSuccess: () => {
          toast.success(t('users.success.edit'));
          queryClient.invalidateQueries({ queryKey: ['managers'] });
          navigate(`/managers/${id}`);
        },
        onError: () => toast.error(t('users.errors.edit')),
      },
    );
  };

  const onInvalid = (error) => {
    console.log(error);
  };

  const defaultValues = {
    name: data?.name,
    username: data?.username,
    email: data?.email,
  };

  const deleteMutation = useDeleteImage();
  const updateMutation = useUpdateImage();

  return (
    <>
      <DashboardTopBar
        isPending={isLoading}
        breadcrumb={[
          { label: t('navbar.text.managers'), href: '/managers' },
          { label: data?.name || id, href: `/managers/${id}` },
          { label: t('general.text.edit'), href: `/managers/${id}/edit` },
        ]}
      />
      <DataDisplay
        data={data}
        isLoading={isLoading}
        error={isError ? t('users.errors.loadOne') : undefined}>
        <PageHead
          head={`${t('general.text.edit')} ${t('users.text.manager')} (${
            data?.name
          })`}
        />

        <div className="mt-[32px]">
          <UserImage
            type="managers"
            deleteMutation={deleteMutation}
            updateMutation={updateMutation}
            imageUrl={
              data?.image?.formats
                ? `${BASE_URL}${data?.image?.formats.thumbnail.url}`
                : null
            }
            name={data?.name}
            id={id}
          />
        </div>
        <div className="mt-[32px]">
          <ManagerForm
            type="edit"
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isPending={isPending}
            submitLabel={t('general.text.update')}
            onInvalid={onInvalid}
          />
        </div>
      </DataDisplay>
    </>
  );
};

export default EditManagerPage;

