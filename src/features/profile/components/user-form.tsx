import React from 'react';
import { useTranslation } from 'react-i18next';
import useEditUserSchema, {
  type EditUserFormData,
} from '../schemas/edit-user-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import useEditUser from '../hooks/use-edit-user';
import Input from '../../../shared/components/input';
import Button from '../../../shared/components/button';
import { queryClient } from '../../../lib/tanstackquery';

const UserForm = ({ data }) => {
  const { t } = useTranslation();
  const { editUserSchema } = useEditUserSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: data.name, // initial value
    },
  });

  const onSubmit = (data: EditUserFormData) => {
    console.log('login data', data);

    mutate(
      { name: data.name },
      {
        onSuccess: (returnedData) => {
          toast.success(t('profile.success.update'));
          queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: (err) => toast.error(t('profile.errors.update')),
      },
    );
  };

  const onInvalid = (errors: any) => {
    console.error('❌ Validation errors:', errors);
  };

  const { isPending, mutate, isError } = useEditUser();

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="flex flex-col gap-[16px] mt-[32px] mb-[32px] items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-[24px]">
            <Input
              label={t('profile.text.name')}
              placeholder={t('profile.text.namePlaceholder')}
              type={'string'}
              {...register('name')}
              errors={errors}
              name={'name'}
              className=""
              disabled={isPending}
            />

            <Input
              label={t('profile.text.email')}
              type={'email'}
              value={data?.email}
              errors={errors}
              name={'email'}
              className=""
              disabled={true}
            />

            <Input
              label={t('profile.text.username')}
              type={'text'}
              value={data?.username}
              errors={errors}
              name={'username'}
              className=""
              disabled={true}
            />
          </div>
        </div>
        <Button disabled={isPending || !isDirty}>
          {isPending ? t('general.pending.updating') : t('general.text.update')}
        </Button>
      </form>
    </div>
  );
};

export default UserForm;

