import React from 'react';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import useUser from '../../../shared/hooks/use-user';
import UserImage from '../components/user-image';
import { BASE_URL } from '../../../shared/constants/api';
import useUpdateImage from '../hooks/use-update-image';
import useDeleteImage from '../hooks/use-delete-image';
import DataDisplay from '../../../shared/components/data-display';
import UserForm from '../components/user-form';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const breadcrumb = [{ label: t('navbar.text.profile'), href: '/profile' }];

  const { data, isPending, isError } = useUser();
  const updateMutation = useUpdateImage();
  const deleteMutation = useDeleteImage();

  return (
    <>
      <DashboardTopBar breadcrumb={breadcrumb}></DashboardTopBar>

      <DataDisplay
        data={data}
        isLoading={isPending}
        error={isError ? t('profile.errors.load') : undefined}>
        <>
          <h2 className="mb-[32px]">
            {t('profile.text.userType')} {t(`profile.text.${data?.type}`)}
          </h2>
          <UserImage
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

