import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useCreateOrEditEmployee from '../hooks/use-create-or-edit-employee';
import { queryClient } from '../../../lib/tanstackquery';
import toast from 'react-hot-toast';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import PageHead from '../../../shared/components/page-head';
import EmployeeForm from '../components/employee-form';

const NewEmployeePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateOrEditEmployee();

  const handleSubmit = (formData: any) => {
    mutate(
      { data: formData },
      {
        onSuccess: (returnedData) => {
          queryClient.invalidateQueries({ queryKey: ['employees'] });
          const id = returnedData.user.id;
          toast.success(t('users.success.createEmployee'));
          navigate(`/employees/${id}`);
        },
        onError: () => toast.error(t('users.errors.createEmployee')),
      },
    );
  };

  const onInvalid = () => {};

  return (
    <>
      <DashboardTopBar
        breadcrumb={[
          { label: t('navbar.text.employees'), href: '/employees' },
          { label: t('general.text.new'), href: `/employees/new` },
        ]}
      />
      <PageHead head={`${t('general.text.new')} ${t('users.text.employee')}`} />

      <div className="mt-[32px]">
        <EmployeeForm
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

export default NewEmployeePage;

