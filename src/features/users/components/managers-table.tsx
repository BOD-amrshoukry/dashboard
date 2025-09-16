// src/pages/ManagersTable.tsx

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../shared/constants/api';
import { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import useDeleteManager from '../hooks/use-delete-manager';
import useDeleteManagers from '../hooks/use-delete-managers';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import { ReusableTable } from '../../../shared/components/table';
import { getManagers } from '../services/get';
import Modal from '../../../shared/components/modal';
import Button from '../../../shared/components/button';
import type { User } from '../types/type';
import type { Column } from '../../../shared/types/table';
import type { ModalDataType } from '../../../shared/types/modal';

export default function ManagersTable() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const columns: Column<User>[] = [
    {
      id: 'image',
      header: t('users.text.image'),
      accessor: (row) => {
        const url = row.image?.formats?.thumbnail?.url;
        return (
          <div className="rounded-level1 h-[48px] w-[48px] bg-main text-second-background flex justify-center items-center font-bold text-[20px] overflow-hidden">
            {url ? (
              <img
                src={`${BASE_URL}${url}`}
                alt={row.name || 'User image'}
                className="w-12 h-12 rounded-level1 object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {`${row?.name?.split(' ')[0][0]}${
                  row?.name?.split(' ')[1]?.[0] ?? ''
                }`.toUpperCase()}
              </div>
            )}
          </div>
        );
      },
      accessorRaw: (row) => row.image?.formats.thumbnail.url,
      sortable: false,
      width: '80px',
    },
    {
      id: 'name',
      header: t('users.text.name'),
      accessor: (row) => row.name,
      accessorRaw: (row) => row.name,
      sortable: true,
      filter: { kind: 'text' },
      fixedVisible: true,
    },
    {
      id: 'username',
      header: t('users.text.username'),
      accessor: (row) => row.username,
      accessorRaw: (row) => row.username,
      sortable: true,
      filter: { kind: 'text' },
    },
    {
      id: 'email',
      header: t('users.text.email'),
      accessor: (row) => row.email,
      accessorRaw: (row) => row.email,
      sortable: true,
      filter: { kind: 'text' },
      hiddenOnMobile: true,
    },
  ];

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState<ModalDataType>();

  const rowActions = [
    {
      label: t('general.text.view'),
      icon: <Eye />,
      onClick: (row: User) => navigate(`/managers/${row.id}`),
    },
    {
      label: t('general.text.edit'),
      icon: <Pencil />,
      onClick: (row: User) => navigate(`/managers/${row.id}/edit`),
    },

    {
      label: t('general.text.delete'),
      icon: <Trash2 />,
      color: 'red',
      onClick: (row: User) => {
        setModalData({
          head: t('users.text.deleteManagerHead'),
          description: t('users.text.deleteManagerDescription', {
            name: row.name,
          }),
          type: 'single',
          action: 'delete',
          value: row,
          ids: row.id,
        });
        setIsOpenModal(true);
      },
      disabled: (row: User, selectedKeys: Set<string | number>) =>
        selectedKeys.size > 1,
    },
  ];

  const bulkActions = [
    {
      label: t('general.text.deleteAll'),
      icon: <Trash2 />,
      onClick: (rows: User[]) => {
        setModalData({
          head: t('users.text.deleteManagerMultipleHead'),
          description: t('users.text.deleteManagerMultipleDescription', {
            count: rows.length,
          }),
          type: 'multiple',
          action: 'delete',
          value: rows,
          ids: rows.map((row) => row?.id),
        });
        setIsOpenModal(true);
      },
    },
  ];

  const {
    mutate: deleteManagerMutate,
    isPending: isPendingDeleteManager,
    isError: isErrorDeleteManager,
  } = useDeleteManager();
  const {
    mutate: deleteManagersMutate,
    isPending: isPendingDeleteManagers,
    isError: isErrorDeleteManagers,
  } = useDeleteManagers();

  const handleSubmit = () => {
    if (modalData?.type === 'single') {
      deleteManagerMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('users.success.deletedOne'));
          queryClient.invalidateQueries({ queryKey: ['managers'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('users.errors.deletedOne')),
      });
    } else {
      deleteManagersMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('users.success.deleted'));
          queryClient.invalidateQueries({ queryKey: ['managers'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('users.errors.deleted')),
      });
    }
  };

  const isPendingCondition = isPendingDeleteManager || isPendingDeleteManagers;

  return (
    <>
      <ReusableTable<User>
        errorMessage={t('users.errors.load')}
        queryKey="managers"
        columns={columns}
        serverSide
        fetchData={getManagers}
        idForRow={(row) => row?.id}
        is3Dots={false}
        rowActions={rowActions}
        bulkActions={bulkActions}
      />

      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <h2 className="text-xl font-bold mb-4">{modalData?.head}</h2>
        <p>{modalData?.description}</p>
        <div className="flex gap-[16px] mt-[24px] flex-col sm:flex-row">
          <Button
            onClick={() => setIsOpenModal(false)}
            className={'w-full'}
            variant="inverse"
            disabled={isPendingCondition}>
            {t('general.text.cancel')}
          </Button>
          <Button
            className={'w-full'}
            onClick={handleSubmit}
            disabled={isPendingCondition}>
            {isPendingCondition
              ? t('general.pending.deleting')
              : t('general.text.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

