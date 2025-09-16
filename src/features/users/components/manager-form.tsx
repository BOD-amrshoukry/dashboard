import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldErrors } from 'react-hook-form';
import Input from '../../../shared/components/input';
import Button from '../../../shared/components/button';
import type { ManagerFormData } from '../schemas/manager-schema';
import useManagerSchema from '../schemas/manager-schema';

interface ManagerFormProps {
  defaultValues?: Partial<ManagerFormData>;
  onSubmit: (data: ManagerFormData) => void;
  onInvalid?: (errors: FieldErrors) => void;
  isPending?: boolean;
  submitLabel?: string;
  type: 'new' | 'edit';
}

const ManagerForm: React.FC<ManagerFormProps> = ({
  defaultValues,
  onSubmit,
  onInvalid,
  isPending,
  type,
}) => {
  const { t } = useTranslation();
  const { managerSchema } = useManagerSchema();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      ...defaultValues, // merge incoming defaults
    },
  });

  const watchedValues = watch();

  // Log whenever any value changes
  useEffect(() => {
    console.log('Form values changed:', watchedValues);
  }, [watchedValues]);

  console.log(defaultValues);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      {/* <div className="grid gap-4 grid-cols-1 md:[grid-template-columns:repeat(auto-fit,minmax(400px,1fr))]"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <Input
          label={t('users.text.name')}
          placeholder={t('users.text.namePlaceholder')}
          type="text"
          {...register('name', {
            setValueAs: (value) => value.trim(),
          })}
          errors={errors}
          name="name"
          className="w-full"
          disabled={isPending}
        />

        <Input
          label={t('users.text.username')}
          placeholder={t('users.text.usernamePlaceholder')}
          type="text"
          {...register('username', {
            setValueAs: (value) => value.trim(),
          })}
          errors={errors}
          name="username"
          className="w-full"
          disabled={isPending || type === 'edit'}
        />
        <Input
          label={t('users.text.email')}
          placeholder={t('users.text.emailPlaceholder')}
          type="email"
          {...register('email', {
            setValueAs: (value) => value.trim().toLowerCase(),
          })}
          errors={errors}
          name="email"
          className="w-full"
          disabled={isPending || type === 'edit'}
        />
      </div>

      <Button className="mt-[32px]" disabled={isPending || !isDirty}>
        {isPending
          ? type === 'new'
            ? t('general.pending.creating')
            : t('general.pending.editing')
          : type === 'new'
          ? t('general.text.create')
          : t('general.text.edit')}
      </Button>
    </form>
  );
};

export default ManagerForm;

