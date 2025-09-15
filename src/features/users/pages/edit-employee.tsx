import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useCreateOrEditEmployee from '../hooks/use-create-or-edit-employee';
import useGetEmployee from '../hooks/use-get-employee';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import useDeleteImage from '../hooks/use-delete-image';
import useUpdateImage from '../hooks/use-update-image';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import UserImage from '../../../shared/components/user-image';
import { BASE_URL } from '../../../shared/constants/api';
import EmployeeForm from '../components/employee-form';
import DataDisplay from '../../../shared/components/data-display';
import PageHead from '../../../shared/components/page-head';

const EditEmployeePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateOrEditEmployee();

  const { data, isError, isPending: isLoading } = useGetEmployee(id);

  const handleSubmit = (formData: any) => {
    mutate(
      { id: id, data: formData },
      {
        onSuccess: () => {
          toast.success(t('users.success.editEmployee'));
          queryClient.invalidateQueries({ queryKey: ['employees'] });
          navigate(`/employees/${id}`);
        },
        onError: () => toast.error(t('users.errors.editEmployee')),
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
          { label: t('navbar.text.employees'), href: '/employees' },
          { label: data?.name || id, href: `/employees/${id}` },
          { label: t('general.text.edit'), href: `/employees/${id}/edit` },
        ]}
      />
      <DataDisplay
        data={data}
        isLoading={isLoading}
        error={isError ? t('users.errors.loadOneEmployee') : undefined}>
        <PageHead
          head={`${t('general.text.edit')} ${t('users.text.employee')} (${
            data?.name
          })`}
        />

        <div className="mt-[32px]">
          <UserImage
            type="employees"
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
          <EmployeeForm
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

export default EditEmployeePage;

