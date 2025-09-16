import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useGetEmployee from '../hooks/use-get-employee';
import { useState } from 'react';
import useDeleteEmployee from '../hooks/use-delete-employee';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import DataDisplay from '../../../shared/components/data-display';
import PageHead from '../../../shared/components/page-head';
import PageAction from '../../../shared/components/page-action';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../../../shared/components/modal';
import Button from '../../../shared/components/button';
import UserImage from '../../../shared/components/user-image';
import { BASE_URL } from '../../../shared/constants/api';
import EmployeeTickets from '../components/employee-tickets';
import EmployeeStats from '../components/employee-stats';

const ViewEmployeePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isError, isPending: isLoading, refetch } = useGetEmployee(id);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const {
    mutate: deleteEmployeeMutate,
    isPending: isPendingDeleteEmployee,
    isError: isErrorDeleteEmployee,
  } = useDeleteEmployee();

  const handleSubmit = () => {
    deleteEmployeeMutate(id, {
      onSuccess: (returnedData) => {
        toast.success(t('users.success.deletedOneEmployee'));
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        setIsOpenModal(false);
        navigate(`/employees`);
      },
      onError: (err) => toast.error(t('users.errors.deletedOneEmployee')),
    });
  };

  console.log(data);

  return (
    <>
      <DashboardTopBar
        isPending={isLoading}
        breadcrumb={[
          { label: t('navbar.text.employees'), href: '/employees' },
          { label: data?.name || id, href: `/employees/${id}` },
        ]}
      />
      <DataDisplay
        data={data}
        isLoading={isLoading}
        refetch={refetch}
        error={isError ? t('users.errors.loadOne') : undefined}>
        <div className="flex gap-[24px] items-center mb-[32px] flex-wrap">
          <PageHead
            head={`${t('general.text.view')} ${t('users.text.employee')} (${
              data?.name
            })`}
          />
          <div className="flex items-center gap-[16px]">
            <PageAction href={`/employees/${id}/edit`}>
              <Pencil />
            </PageAction>
            <PageAction
              href={false}
              onClick={() => {
                setModalData({
                  head: t('users.text.deleteHead'),
                  description: t('users.text.deleteDescription', {
                    name: data?.name,
                  }),
                  type: 'single',
                  action: 'delete',
                  value: data?.data,
                  id: data?.id,
                });
                setIsOpenModal(true);
              }}>
              <Trash2 />
            </PageAction>
          </div>

          <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
            <h2 className="text-xl font-bold mb-4">{modalData?.head}</h2>
            <p>{modalData?.description}</p>
            <div className="flex gap-[16px] mt-[24px] flex-col sm:flex-row">
              <Button
                onClick={() => setIsOpenModal(false)}
                className={'w-full'}
                variant="inverse"
                disabled={isPendingDeleteEmployee}>
                {t('general.text.cancel')}
              </Button>
              <Button
                className={'w-full'}
                onClick={handleSubmit}
                disabled={isPendingDeleteEmployee}>
                {isPendingDeleteEmployee
                  ? t('general.pending.deleting')
                  : t('general.text.delete')}
              </Button>
            </div>
          </Modal>
        </div>

        <div className="mb-[32px]">
          <UserImage
            viewOnly={true}
            imageUrl={
              data?.image?.formats
                ? `${BASE_URL}${data?.image?.formats.thumbnail.url}`
                : null
            }
            name={data?.name}
            id={id}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-main-text-helper">
              {t('users.text.name')}
            </span>
            <span className="text-base text-main-text">
              {data?.name || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-main-text-helper">
              {t('users.text.username')}
            </span>
            <span className="text-base text-main-text">
              {data?.username || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-main-text-helper">
              {t('users.text.email')}
            </span>
            <span className="text-base text-main-text">
              {data?.email || '-'}
            </span>
          </div>
        </div>

        <EmployeeTickets data={data} />

        <div className="mt-[32px]">
          <EmployeeStats />
        </div>
      </DataDisplay>
    </>
  );
};

export default ViewEmployeePage;

