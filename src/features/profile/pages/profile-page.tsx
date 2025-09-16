import React from 'react';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import useUser from '../../../shared/hooks/use-user';
import UserImage from '../../../shared/components/user-image';
import { BASE_URL } from '../../../shared/constants/api';
import useUpdateImage from '../hooks/use-update-image';
import useDeleteImage from '../hooks/use-delete-image';
import DataDisplay from '../../../shared/components/data-display';
import UserForm from '../components/user-form';
import { useTranslation } from 'react-i18next';
import { decodeJwt, getCookie } from '../../../shared/utils/auth';

const ProfilePage = () => {
  const { t } = useTranslation();
  const breadcrumb = [{ label: t('navbar.text.profile'), href: '/profile' }];

  const { data, isPending, isError, refetch } = useUser();
  const updateMutation = useUpdateImage();
  const deleteMutation = useDeleteImage();

  const id = decodeJwt(String(getCookie('token'))).id;

  return (
    <>
      <DashboardTopBar breadcrumb={breadcrumb}></DashboardTopBar>

      <DataDisplay
        refetch={refetch}
        data={data}
        isLoading={isPending}
        error={isError ? t('profile.errors.load') : undefined}>
        <>
          <h2 className="mb-[32px]">
            {t('profile.text.userType')} {t(`profile.text.${data?.type}`)}
          </h2>
          <UserImage
            type="me"
            id={id}
            imageUrl={
              data?.image?.formats
                ? `${BASE_URL}${data?.image?.formats.thumbnail.url}`
                : null
            }
            name={data?.name}
            deleteMutation={deleteMutation}
            updateMutation={updateMutation}
          />

          <UserForm data={data} />
        </>
      </DataDisplay>
    </>
  );
};

export default ProfilePage;

